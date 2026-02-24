import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useUser } from "../src/context/UserContext";
import { supabase } from "../src/lib/supabase";
import { SearchIcon, UserPlusIcon, ArrowLeftIcon } from "../src/components/Icons";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default function Friends() {
  const { session } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);

  // Load who the current user follows
  useEffect(() => {
    if (!session) return;
    supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", session.user.id)
      .then(({ data }) => {
        if (data) setFollowing(data.map((f: any) => f.following_id));
      });

    supabase
      .from("follows")
      .select("follower_id, profiles!follows_follower_id_fkey(id, username, full_name, avatar_url)")
      .eq("following_id", session.user.id)
      .then(({ data }) => {
        if (data) {
          const profiles = data
            .map((f: any) => f.profiles)
            .filter(Boolean) as Profile[];
          setFollowers(profiles);
        }
      });
  }, [session]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url")
      .ilike("username", `%${query.trim()}%`)
      .neq("id", session?.user.id ?? "")
      .limit(20);
    setResults((data as Profile[]) ?? []);
    setSearching(false);
  }, [query, session]);

  const handleFollow = async (userId: string) => {
    if (!session) return;
    const { error } = await supabase
      .from("follows")
      .insert({ follower_id: session.user.id, following_id: userId });
    if (!error) {
      setFollowing((prev) => [...prev, userId]);
      Toast.show({ type: "success", text1: "Following!", position: "top" });
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!session) return;
    await supabase
      .from("follows")
      .delete()
      .match({ follower_id: session.user.id, following_id: userId });
    setFollowing((prev) => prev.filter((id) => id !== userId));
    Toast.show({ type: "success", text1: "Unfollowed", position: "top" });
  };

  const renderUser = ({ item }: { item: Profile }) => {
    const isFollowing = following.includes(item.id);
    return (
      <View style={styles.userRow}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarLetter}>
            {(item.username ?? "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{item.full_name ?? item.username}</Text>
          <Text style={styles.userHandle}>@{item.username}</Text>
        </View>
        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followButtonActive]}
          onPress={() => (isFollowing ? handleUnfollow(item.id) : handleFollow(item.id))}
          activeOpacity={0.85}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const listData = query.trim() ? results : followers;
  const listLabel = query.trim() ? `Results for "${query}"` : "People who follow you";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeftIcon size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <SearchIcon size={18} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.85}>
          {searching ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.searchButtonText}>Search</Text>}
        </TouchableOpacity>
      </View>

      {/* List */}
      <Text style={styles.sectionLabel}>{listLabel}</Text>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <UserPlusIcon size={40} color="#ccc" />
            <Text style={styles.emptyText}>
              {query.trim() ? "No users found" : "No followers yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0", gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  searchRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff" },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#f5f5f5", borderRadius: 999, paddingHorizontal: 16 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#000" },
  searchButton: { backgroundColor: "#000", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 12 },
  searchButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  sectionLabel: { fontSize: 13, fontWeight: "600", color: "#888", paddingHorizontal: 20, paddingVertical: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  userRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", marginHorizontal: 16, marginBottom: 10, borderRadius: 16, gap: 12 },
  userAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  userAvatarLetter: { color: "#fff", fontSize: 20, fontWeight: "600" },
  userName: { fontSize: 15, fontWeight: "600", color: "#000" },
  userHandle: { fontSize: 13, color: "#888" },
  followButton: { borderWidth: 1.5, borderColor: "#000", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  followButtonActive: { backgroundColor: "#f0f0f0", borderColor: "#e0e0e0" },
  followButtonText: { fontSize: 13, fontWeight: "600", color: "#000" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: "#aaa" },
});
