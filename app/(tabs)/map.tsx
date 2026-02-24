import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { mockRestaurants, foodCategories, Restaurant } from "../../src/data/restaurants";
import { StarIcon, LocationIcon, CloseIcon } from "../../src/components/Icons";

const getCurrentDay = () => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
};

export default function MapViewScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === "all") return mockRestaurants;
    return mockRestaurants.filter((r) => r.category === selectedCategory);
  }, [selectedCategory]);

  const currentDay = getCurrentDay();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />

      {/* Map */}
      <MapView
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.lat, longitude: restaurant.lng }}
            onPress={() => setSelectedRestaurant(restaurant)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>🍽️</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Category filter */}
      <View style={[styles.filterBar, { top: insets.top + 12 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          {foodCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filterChip, selectedCategory === cat.id && styles.filterChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.filterEmoji}>{cat.emoji}</Text>
              <Text style={[styles.filterText, selectedCategory === cat.id && { color: "#fff" }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Restaurant detail bottom sheet */}
      {selectedRestaurant && (
        <View style={[styles.detailSheet, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.detailCloseButton}
            onPress={() => setSelectedRestaurant(null)}
          >
            <CloseIcon size={18} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.detailName}>{selectedRestaurant.name}</Text>
            <Text style={styles.detailCuisine}>{selectedRestaurant.cuisine}</Text>

            <View style={styles.detailMeta}>
              <View style={styles.metaItem}>
                <LocationIcon size={14} color="#888" />
                <Text style={styles.metaText}>{selectedRestaurant.distance} mi away</Text>
              </View>
              <View style={styles.metaItem}>
                <StarIcon size={14} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.metaText}>{selectedRestaurant.rating}</Text>
              </View>
              <Text style={styles.hoursText}>
                Today: {selectedRestaurant.hours[currentDay as keyof typeof selectedRestaurant.hours]}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              setSelectedRestaurant(null);
              router.push(`/restaurant/${selectedRestaurant.id}`);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  marker: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  markerText: { fontSize: 20 },
  filterBar: { position: "absolute", left: 0, right: 0, zIndex: 10 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  filterChipActive: { backgroundColor: "#000" },
  filterEmoji: { fontSize: 14 },
  filterText: { fontSize: 13, fontWeight: "500", color: "#000" },
  detailSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  detailCloseButton: { position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 16, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center", zIndex: 1 },
  detailName: { fontSize: 20, fontWeight: "600", color: "#000", marginBottom: 4, marginRight: 40 },
  detailCuisine: { fontSize: 14, color: "#888", marginBottom: 12 },
  detailMeta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 13, color: "#666" },
  hoursText: { fontSize: 13, color: "#666" },
  viewButton: { marginTop: 16, backgroundColor: "#000", borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  viewButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
