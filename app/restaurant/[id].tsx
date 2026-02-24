import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { getRestaurantById } from "../../src/data/restaurants";
import { useUser } from "../../src/context/UserContext";
import { ArrowLeftIcon, HeartIcon, StarIcon, LocationIcon, NavigationIcon, ShoppingBagIcon, CloseIcon } from "../../src/components/Icons";

const orderingServiceLabels: Record<string, { label: string; emoji: string }> = {
  website: { label: "Restaurant Website", emoji: "🌐" },
  doordash: { label: "DoorDash", emoji: "🏍️" },
  ubereats: { label: "Uber Eats", emoji: "🚗" },
  grubhub: { label: "Grubhub", emoji: "🍔" },
  postmates: { label: "Postmates", emoji: "📦" },
};

export default function RestaurantDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userData, saveRestaurant, unsaveRestaurant, rateRestaurant, getRating } = useUser();

  const [showNavModal, setShowNavModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [existingRating, setExistingRating] = useState<{ rating: number; review?: string } | null>(null);

  const restaurant = id ? getRestaurantById(id) : null;
  const isSaved = restaurant ? userData.savedRestaurants.includes(restaurant.id) : false;

  useEffect(() => {
    if (id) {
      getRating(id).then(setExistingRating);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 18, marginBottom: 16 }}>Restaurant not found</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)/swipe")}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveRestaurant(restaurant.id);
      Toast.show({ type: "success", text1: "Removed from saved", position: "top" });
    } else {
      saveRestaurant(restaurant.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: "Saved!", position: "top" });
    }
  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      await rateRestaurant(restaurant.id, rating, review);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: "success", text1: "Thanks for your rating!", position: "top" });
      setShowRatingModal(false);
      setExistingRating({ rating, review });
      setRating(0);
      setReview("");
    }
  };

  const openMaps = async (app: string) => {
    const address = encodeURIComponent(restaurant.address);
    const urls: Record<string, string> = {
      apple: `maps://?q=${address}`,
      google: `comgooglemaps://?q=${address}`,
      waze: `waze://?q=${address}`,
    };
    const fallbacks: Record<string, string> = {
      apple: `https://maps.apple.com/?q=${address}`,
      google: `https://www.google.com/maps/search/?api=1&query=${address}`,
      waze: `https://waze.com/ul?q=${address}`,
    };
    setShowNavModal(false);
    try {
      const canOpen = await Linking.canOpenURL(urls[app]);
      await Linking.openURL(canOpen ? urls[app] : fallbacks[app]);
    } catch {
      await Linking.openURL(fallbacks[app]);
    }
  };

  const openOrderService = async (url: string) => {
    setShowOrderModal(false);
    Toast.show({ type: "success", text1: "Opening ordering service...", position: "top" });
    await Linking.openURL(url);
  };

  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={{ height: 300, position: "relative" }}>
          <Image source={{ uri: restaurant.thumbnailUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]} />

          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 8 }]}
            onPress={() => router.back()}
          >
            <ArrowLeftIcon size={20} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { top: insets.top + 8, backgroundColor: isSaved ? "#000" : "rgba(255,255,255,0.9)" }]}
            onPress={handleToggleSave}
            activeOpacity={0.85}
          >
            <HeartIcon size={20} color={isSaved ? "#fff" : "#000"} fill={isSaved ? "#fff" : "none"} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.distanceRow}>
                <LocationIcon size={14} color="#888" />
                <Text style={styles.distanceText}>{restaurant.distance} miles away</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <StarIcon size={16} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowNavModal(true)} activeOpacity={0.85}>
              <NavigationIcon size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineActionButton} onPress={() => setShowRatingModal(true)} activeOpacity={0.85}>
              <StarIcon size={18} color="#000" />
              <Text style={styles.outlineActionText}>{existingRating ? "Update" : "Rate"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineActionButton} onPress={() => setShowOrderModal(true)} activeOpacity={0.85}>
              <ShoppingBagIcon size={18} color="#000" />
              <Text style={styles.outlineActionText}>Order</Text>
            </TouchableOpacity>
          </View>

          {/* Existing rating */}
          {existingRating && (
            <View style={styles.existingRating}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Text style={{ fontWeight: "600" }}>Your rating:</Text>
                <View style={{ flexDirection: "row" }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size={14} color={i < existingRating.rating ? "#f59e0b" : "#ddd"} fill={i < existingRating.rating ? "#f59e0b" : "none"} />
                  ))}
                </View>
              </View>
              {existingRating.review && <Text style={{ fontSize: 13, color: "#666" }}>{existingRating.review}</Text>}
            </View>
          )}

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionBody}>{restaurant.description}</Text>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionBody}>{restaurant.address}</Text>
          </View>

          {/* Hours */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hours</Text>
            {Object.entries(restaurant.hours).map(([day, hours]) => {
              const isToday = day === currentDay;
              return (
                <View key={day} style={[styles.hoursRow, isToday && styles.hoursRowToday]}>
                  <Text style={[styles.hoursDay, isToday && { fontWeight: "600" }]}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                  <Text style={[styles.hoursTime, isToday && { color: "#000", fontWeight: "600" }]}>{hours}</Text>
                </View>
              );
            })}
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuisine & Tags</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {restaurant.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigate Modal */}
      <Modal visible={showNavModal} transparent animationType="fade" onRequestClose={() => setShowNavModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowNavModal(false)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose your maps app</Text>
            <TouchableOpacity onPress={() => setShowNavModal(false)}><CloseIcon size={20} color="#000" /></TouchableOpacity>
          </View>
          {[{ key: "apple", label: "Apple Maps", emoji: "🗺️" }, { key: "google", label: "Google Maps", emoji: "🌍" }, { key: "waze", label: "Waze", emoji: "🚗" }].map((app) => (
            <TouchableOpacity key={app.key} style={styles.modalButton} onPress={() => openMaps(app.key)} activeOpacity={0.85}>
              <Text style={{ fontSize: 22 }}>{app.emoji}</Text>
              <Text style={styles.modalButtonText}>{app.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={showRatingModal} transparent animationType="fade" onRequestClose={() => setShowRatingModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRatingModal(false)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rate {restaurant.name}</Text>
            <TouchableOpacity onPress={() => setShowRatingModal(false)}><CloseIcon size={20} color="#000" /></TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => { setRating(star); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                <StarIcon size={40} color={star <= rating ? "#f59e0b" : "#ddd"} fill={star <= rating ? "#f59e0b" : "none"} />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, rating === 0 && { backgroundColor: "#ccc" }]}
            onPress={handleSubmitRating}
            disabled={rating === 0}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Submit Rating</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Order Modal */}
      <Modal visible={showOrderModal} transparent animationType="fade" onRequestClose={() => setShowOrderModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOrderModal(false)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order from {restaurant.name}</Text>
            <TouchableOpacity onPress={() => setShowOrderModal(false)}><CloseIcon size={20} color="#000" /></TouchableOpacity>
          </View>
          {restaurant.orderingServices && Object.entries(restaurant.orderingServices).map(([service, url]) => (
            <TouchableOpacity key={service} style={styles.modalButton} onPress={() => openOrderService(url as string)} activeOpacity={0.85}>
              <Text style={{ fontSize: 22 }}>{orderingServiceLabels[service]?.emoji}</Text>
              <Text style={styles.modalButtonText}>{orderingServiceLabels[service]?.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  restaurantName: { fontSize: 28, fontWeight: "600", color: "#000", marginBottom: 6 },
  distanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distanceText: { fontSize: 14, color: "#888" },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 18, fontWeight: "600", color: "#000" },
  actionRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#000", borderRadius: 999, paddingVertical: 12 },
  actionButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  outlineActionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1.5, borderColor: "#000", borderRadius: 999, paddingVertical: 12 },
  outlineActionText: { color: "#000", fontWeight: "600", fontSize: 14 },
  existingRating: { backgroundColor: "rgba(34,197,94,0.1)", borderRadius: 16, padding: 14, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#000", marginBottom: 8 },
  sectionBody: { fontSize: 15, color: "#555", lineHeight: 22 },
  hoursRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  hoursRowToday: { backgroundColor: "rgba(0,0,0,0.06)" },
  hoursDay: { fontSize: 14, color: "#444", textTransform: "capitalize" },
  hoursTime: { fontSize: 14, color: "#888" },
  tag: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#f0f0f0", borderRadius: 999 },
  tagText: { fontSize: 13, color: "#444" },
  backButton: { position: "absolute", left: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },
  saveButton: { position: "absolute", right: 16, width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  button: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1 },
  modalSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, zIndex: 2 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "600", color: "#000" },
  modalButton: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, borderTopWidth: 1, borderTopColor: "#f5f5f5" },
  modalButtonText: { fontSize: 16, color: "#000" },
});
