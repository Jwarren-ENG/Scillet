import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useUser } from "../../src/context/UserContext";
import { mockRestaurants, Restaurant, foodCategories, cities } from "../../src/data/restaurants";
import { HeartIcon, CloseIcon, LocationIcon } from "../../src/components/Icons";
import { SwipeCard } from "../../src/components/SwipeCard";
import { LocationBottomSheet } from "../../src/components/LocationBottomSheet";
import { FilterBottomSheet } from "../../src/components/FilterBottomSheet";
import { supabase } from "../../src/lib/supabase";

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [radius, setRadius] = useState(10);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { saveRestaurant } = useUser();
  const insets = useSafeAreaInsets();

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    setCurrentIndex(0);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { data, error } = await supabase.functions.invoke("search-restaurants", {
          body: {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            radius,
            category: selectedCategory,
          },
        });
        if (!error && Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
          return;
        }
      }
    } catch {
      // Fall through to cached / mock data
    }

    // Fallback: cached restaurants from Supabase DB
    try {
      let query = supabase.from("restaurants").select("*").limit(30);
      if (selectedCategory !== "all") query = query.eq("category", selectedCategory);
      const { data } = await query;
      if (data && data.length > 0) {
        const mapped: Restaurant[] = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description ?? "",
          address: r.address ?? "",
          city: r.city ?? "",
          distance: 0,
          rating: r.rating ?? 0,
          cuisine: r.cuisine ?? "",
          tags: r.tags ?? [],
          videoUrl: "",
          thumbnailUrl: r.thumbnail_url ?? "",
          lat: r.lat,
          lng: r.lng,
          hours: r.hours ?? {},
          category: r.category ?? "american",
          orderingServices: r.ordering_services ?? undefined,
        }));
        setRestaurants(mapped);
        return;
      }
    } catch {
      // Fall through to mock data
    }

    // Last resort: mock data (filtered)
    let filtered = mockRestaurants;
    if (selectedCategory !== "all") filtered = filtered.filter((r) => r.category === selectedCategory);
    if (selectedCity !== "all") filtered = filtered.filter((r) => r.city === selectedCity);
    setRestaurants(filtered);
  }, [selectedCategory, selectedCity, radius]);

  useEffect(() => {
    fetchRestaurants().finally(() => setIsLoading(false));
  }, [fetchRestaurants]);

  const currentRestaurant = useMemo(() => restaurants[currentIndex], [restaurants, currentIndex]);
  const nextRestaurant = useMemo(() => restaurants[currentIndex + 1], [restaurants, currentIndex]);

  const moveToNext = useCallback(() => {
    if (currentIndex < restaurants.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Toast.show({ type: "success", text1: "You've seen all restaurants!", position: "top" });
      setCurrentIndex(0);
    }
  }, [currentIndex, restaurants.length]);

  const handleSave = useCallback(() => {
    if (currentRestaurant) {
      saveRestaurant(currentRestaurant.id);
      Toast.show({ type: "success", text1: `Saved ${currentRestaurant.name}!`, position: "top" });
      moveToNext();
    }
  }, [currentRestaurant, saveRestaurant, moveToNext]);

  const handleSkip = useCallback(() => {
    moveToNext();
  }, [moveToNext]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 16, fontSize: 15 }}>
          Finding restaurants...
        </Text>
      </View>
    );
  }

  if (!currentRestaurant) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <Text style={{ color: "white", fontSize: 18, marginBottom: 16 }}>No restaurants found</Text>
        <TouchableOpacity
          onPress={() => fetchRestaurants().finally(() => setIsLoading(false))}
          style={{ backgroundColor: "#fff", borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24 }}
        >
          <Text style={{ fontWeight: "600" }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Top floating buttons */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => setIsLocationOpen(true)}
          activeOpacity={0.85}
        >
          <LocationIcon size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.topButton}
          onPress={() => setIsFilterOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.logoLetter}>S</Text>
        </TouchableOpacity>
      </View>

      {/* Card area */}
      <View style={styles.cardArea}>
        {/* Next card (background preview) */}
        {nextRestaurant && (
          <View style={[StyleSheet.absoluteFill, { transform: [{ scale: 0.95 }], opacity: 0.5 }]}>
            <Image
              source={{ uri: nextRestaurant.thumbnailUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Current swipe card */}
        <SwipeCard
          restaurant={currentRestaurant}
          onSwipeRight={handleSave}
          onSwipeLeft={handleSkip}
          isTop
        />

        {/* TikTok-style right side action bar */}
        <View style={[styles.actionBar, { bottom: 100 + insets.bottom }]}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave} activeOpacity={0.85}>
            <HeartIcon size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSkip} activeOpacity={0.85}>
            <CloseIcon size={20} color="white" />
          </TouchableOpacity>

          <View style={styles.swipeHint}>
            <View style={styles.swipeHintBar} />
            <Text style={styles.swipeHintText}>SWIPE</Text>
          </View>
        </View>
      </View>

      {/* Modals */}
      <LocationBottomSheet
        visible={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        radius={radius}
        setRadius={setRadius}
      />
      <FilterBottomSheet
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  topButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: "white", fontSize: 22, fontWeight: "bold" },
  cardArea: { flex: 1, overflow: "hidden" },
  actionBar: {
    position: "absolute",
    right: 12,
    alignItems: "center",
    gap: 16,
    zIndex: 20,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeHint: { marginTop: 8, alignItems: "center", gap: 4 },
  swipeHintBar: { width: 32, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)" },
  swipeHintText: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: "600", letterSpacing: 1.5 },
});
