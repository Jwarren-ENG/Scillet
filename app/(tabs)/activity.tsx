import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useUser } from "../../src/context/UserContext";
import { supabase } from "../../src/lib/supabase";
import { UserPlusIcon } from "../../src/components/Icons";

interface FeedItem {
  id: string;
  created_at: string;
  user: { username: string; full_name: string | null };
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    thumbnail_url: string;
  };
}

export default function Activity() {
  const { session } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    loadFeed();
  }, [session]);

  const loadFeed = async () => {
    if (!session) return;
    setLoading(true);
    try {
      // Get who I follow
      const { data: followsData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", session.user.id);

      const followingIds = (followsData ?? []).map((f: any) => f.following_id);
      if (followingIds.length === 0) {
        setFeed([]);
        setLoading(false);
        return;
      }

      // Get their recent saves
      const { data: savesData } = await supabase
        .from("saves")
        .select(`
          id,
          created_at,
          profiles!saves_user_id_fkey(username, full_name),
          restaurants(id, name, cuisine, thumbnail_url)
        `)
        .in("user_id", followingIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (savesData) {
        const items: FeedItem[] = savesData
          .filter((s: any) => s.restaurants)
          .map((s: any) => ({
            id: s.id,
            created_at: s.created_at,
            user: s.profiles ?? { username: "unknown", full_name: null },
            restaurant: s.restaurants,
          }));
        setFeed(items);

        // Real-time updates
        const channel = supabase
          .channel("friend-saves")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "saves",
              filter: `user_id=in.(${followingIds.join(",")})`,
            },
            async (payload: any) => {
              // Fetch full data for this new save
              const { data } = await supabase
                .from("saves")
                .select(`
                  id,
                  created_at,
                  profiles!saves_user_id_fkey(username, full_name),
                  restaurants(id, name, cuisine, thumbnail_url)
                `)
                .eq("id", payload.new.id)
                .single();
              if (data && data.restaurants) {
                setFeed((prev) => [
                  {
                    id: data.id,
                    created_at: data.created_at,
                    user: (data as any).profiles ?? { username: "unknown", full_name: null },
                    restaurant: (data as any).restaurants,
                  },
                  ...prev,
                ]);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (feed.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
          <TouchableOpacity
            style={styles.friendsButton}
            onPress={() => router.push("/friends")}
            activeOpacity={0.85}
          >
            <UserPlusIcon size={18} color="#000" />
            <Text style={styles.friendsButtonText}>Find Friends</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <UserPlusIcon size={48} color="#ddd" />
          <Text style={styles.emptyTitle}>Follow people to see their saves</Text>
          <Text style={styles.emptySubtitle}>
            When friends save a restaurant, it'll show up here.
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/friends")}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>Find Friends</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <TouchableOpacity
          style={styles.friendsButton}
          onPress={() => router.push("/friends")}
          activeOpacity={0.85}
        >
          <UserPlusIcon size={18} color="#000" />
          <Text style={styles.friendsButtonText}>Friends</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.feedCard}
            onPress={() => router.push(`/restaurant/${item.restaurant.id}`)}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.restaurant.thumbnail_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardUser}>
                <Text style={{ fontWeight: "700" }}>
                  {item.user.full_name ?? `@${item.user.username}`}
                </Text>
                {" saved a spot"}
              </Text>
              <Text style={styles.cardRestaurant}>{item.restaurant.name}</Text>
              <Text style={styles.cardCuisine}>{item.restaurant.cuisine}</Text>
              <Text style={styles.cardTime}>{timeAgo(item.created_at)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 28, fontWeight: "600", color: "#000" },
  friendsButton: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderColor: "#000", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  friendsButtonText: { fontSize: 13, fontWeight: "600", color: "#000" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, gap: 12 },
  loadingText: { fontSize: 15, color: "#aaa" },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: "#000", textAlign: "center" },
  emptySubtitle: { fontSize: 15, color: "#888", textAlign: "center" },
  ctaButton: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 14, paddingHorizontal: 28, marginTop: 8 },
  ctaButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  feedCard: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardImage: { width: 100, height: 100 },
  cardContent: { flex: 1, padding: 14, justifyContent: "center", gap: 2 },
  cardUser: { fontSize: 14, color: "#333" },
  cardRestaurant: { fontSize: 16, fontWeight: "600", color: "#000" },
  cardCuisine: { fontSize: 13, color: "#888" },
  cardTime: { fontSize: 12, color: "#aaa", marginTop: 4 },
});
