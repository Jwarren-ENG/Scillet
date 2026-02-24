import { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useUser } from "../../src/context/UserContext";
import { getRestaurantById } from "../../src/data/restaurants";
import { LocationIcon, StarIcon, SavedIcon } from "../../src/components/Icons";

export default function SavedList() {
  const { userData } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const savedRestaurants = useMemo(
    () => userData.savedRestaurants.map((id) => getRestaurantById(id)).filter(Boolean),
    [userData.savedRestaurants]
  );

  if (savedRestaurants.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.emptyHeader}>
          <Text style={styles.headerTitle}>Saved Places</Text>
          <Text style={styles.headerSubtitle}>0 places to try</Text>
        </View>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIcon}>
            <SavedIcon size={40} color="#aaa" />
          </View>
          <Text style={styles.emptyTitle}>No saved places yet</Text>
          <Text style={styles.emptySubtitle}>Start swiping to save places you want to try</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.push("/(tabs)/swipe")}>
            <Text style={styles.ctaButtonText}>Start Swiping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.headerSubtitle}>
          {savedRestaurants.length} {savedRestaurants.length === 1 ? "place" : "places"} to try
        </Text>
      </View>

      <FlatList
        data={savedRestaurants}
        keyExtractor={(item) => item!.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item: restaurant }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/restaurant/${restaurant!.id}`)}
            activeOpacity={0.85}
          >
            <Image source={{ uri: restaurant!.thumbnailUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardName}>{restaurant!.name}</Text>
              <Text style={styles.cardCuisine}>{restaurant!.cuisine}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <LocationIcon size={14} color="#aaa" />
                  <Text style={styles.metaText}>{restaurant!.distance} mi</Text>
                </View>
                <View style={styles.metaItem}>
                  <StarIcon size={14} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.metaText}>{restaurant!.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  emptyContainer: { flex: 1, backgroundColor: "#fafafa" },
  header: { padding: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  emptyHeader: { padding: 24, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  headerTitle: { fontSize: 28, fontWeight: "600", color: "#000" },
  headerSubtitle: { fontSize: 14, color: "#888", marginTop: 4 },
  emptyContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: "#000", marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: "#888", textAlign: "center", marginBottom: 24 },
  ctaButton: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 14, paddingHorizontal: 28 },
  ctaButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardImage: { width: 112, height: 112 },
  cardContent: { flex: 1, padding: 16, justifyContent: "center" },
  cardName: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 4 },
  cardCuisine: { fontSize: 13, color: "#888", marginBottom: 10 },
  cardMeta: { flexDirection: "row", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13, color: "#666" },
});
