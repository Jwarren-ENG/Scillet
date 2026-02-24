import { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { useUser } from "../../src/context/UserContext";
import { mockRestaurants, Restaurant, foodCategories, cities } from "../../src/data/restaurants";
import { HeartIcon, CloseIcon, LocationIcon } from "../../src/components/Icons";
import { SwipeCard } from "../../src/components/SwipeCard";
import { LocationBottomSheet } from "../../src/components/LocationBottomSheet";
import { FilterBottomSheet } from "../../src/components/FilterBottomSheet";

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [radius, setRadius] = useState(10);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { saveRestaurant } = useUser();
  const insets = useSafeAreaInsets();

  // Filter restaurants
  useEffect(() => {
    let filtered = mockRestaurants;
    if (selectedCategory !== "all") filtered = filtered.filter((r) => r.category === selectedCategory);
    if (selectedCity !== "all") filtered = filtered.filter((r) => r.city === selectedCity);
    setRestaurants(filtered);
    setCurrentIndex(0);
  }, [selectedCategory, selectedCity]);

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

  if (!currentRestaurant) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
        <Text style={{ color: "white", fontSize: 18 }}>Loading...</Text>
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <HeartIcon size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSkip}
            activeOpacity={0.85}
          >
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
