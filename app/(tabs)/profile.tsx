import { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useUser } from "../../src/context/UserContext";
import { ChevronRightIcon, LogOutIcon } from "../../src/components/Icons";
import { supabase } from "../../src/lib/supabase";

export default function Profile() {
  const { userData, clearAllData, session } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [ratingsCount, setRatingsCount] = useState(0);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .then(({ count }) => setRatingsCount(count ?? 0));
  }, [session]);

  const handleLogout = useCallback(async () => {
    await clearAllData();
    router.replace("/auth");
  }, [clearAllData, router]);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      {/* Header / avatar */}
      <View style={styles.header}>
        {userData.profilePhoto ? (
          <Image source={{ uri: userData.profilePhoto }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {userData.name.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
        )}
        <Text style={styles.name}>{userData.name || "Your Name"}</Text>
        <Text style={styles.username}>@{userData.username || "username"}</Text>
        {userData.contact ? <Text style={styles.contact}>{userData.contact}</Text> : null}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData.savedRestaurants.length}</Text>
          <Text style={styles.statLabel}>Saved Places</Text>
        </View>
        <View style={[styles.statCard, { borderLeftWidth: 1, borderLeftColor: "#f0f0f0" }]}>
          <Text style={[styles.statNumber, { color: "#22c55e" }]}>{ratingsCount}</Text>
          <Text style={styles.statLabel}>Ratings</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/(onboarding)/dietary")}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Dietary Restrictions</Text>
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {userData.dietaryRestrictions.length > 0 ? userData.dietaryRestrictions.join(", ") : "None selected"}
            </Text>
          </View>
          <ChevronRightIcon size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => router.push("/(onboarding)/preferences")}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Food Preferences</Text>
            <Text style={styles.rowSubtitle} numberOfLines={1}>
              {userData.foodPreferences.length > 0 ? userData.foodPreferences.join(", ") : "None selected"}
            </Text>
          </View>
          <ChevronRightIcon size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <LogOutIcon size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 24, alignItems: "center", paddingBottom: 40 }}>
        <Text style={{ fontSize: 13, color: "#bbb" }}>Scillet v1.0.0</Text>
        <Text style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Discover food that's cooking nearby</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#000", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarImage: { width: 96, height: 96, borderRadius: 48, marginBottom: 12 },
  avatarLetter: { color: "#fff", fontSize: 40, fontWeight: "600" },
  name: { fontSize: 24, fontWeight: "600", color: "#000" },
  username: { fontSize: 15, color: "#888", marginTop: 2 },
  contact: { fontSize: 13, color: "#bbb", marginTop: 2 },
  statsRow: { flexDirection: "row", backgroundColor: "#fff", marginTop: 12 },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 20 },
  statNumber: { fontSize: 28, fontWeight: "700", color: "#000" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 2 },
  section: { marginTop: 12, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#f5f5f5" },
  rowTitle: { fontSize: 15, fontWeight: "500", color: "#000", marginBottom: 2 },
  rowSubtitle: { fontSize: 13, color: "#aaa" },
  logoutButton: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#f5f5f5", paddingBottom: 20 },
  logoutText: { color: "#ef4444", fontSize: 15, fontWeight: "500" },
});
