import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { Restaurant } from "../data/restaurants";
import { LocationIcon } from "./Icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  restaurant: Restaurant;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  isTop: boolean;
}

export function SwipeCard({ restaurant, onSwipeRight, onSwipeLeft, isTop }: SwipeCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const rotate = useDerivedValue(() =>
    interpolate(translateX.value, [-200, 0, 200], [-25, 0, 25], Extrapolation.CLAMP)
  );

  const cardOpacity = useDerivedValue(() =>
    interpolate(Math.abs(translateX.value), [0, 200], [1, 0], Extrapolation.CLAMP)
  );

  const nopeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [-200, -50, 0], [1, 0.5, 0], Extrapolation.CLAMP)
  );

  const likeOpacity = useDerivedValue(() =>
    interpolate(translateX.value, [0, 50, 200], [0, 0.5, 1], Extrapolation.CLAMP)
  );

  const triggerHaptic = (type: "save" | "skip") => {
    if (type === "save") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const panGesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.1;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 1 : -1;
        const hapticType = direction > 0 ? "save" : "skip";
        runOnJS(triggerHaptic)(hapticType);
        translateX.value = withSpring(direction * (SCREEN_WIDTH + 100), { damping: 15 }, () => {
          runOnJS(direction > 0 ? onSwipeRight : onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: cardOpacity.value,
  }));

  const nopeStyle = useAnimatedStyle(() => ({ opacity: nopeOpacity.value }));
  const likeStyle = useAnimatedStyle(() => ({ opacity: likeOpacity.value }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[StyleSheet.absoluteFill, cardAnimStyle]}>
        <Image
          source={{ uri: restaurant.thumbnailUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <View style={styles.gradient} />

        {/* NOPE indicator */}
        <Animated.View style={[styles.nopeIndicator, nopeStyle]}>
          <Text style={styles.nopeText}>✕</Text>
        </Animated.View>

        {/* LIKE indicator */}
        <Animated.View style={[styles.likeIndicator, likeStyle]}>
          <Text style={styles.likeText}>♡</Text>
        </Animated.View>

        {/* Restaurant info */}
        <View style={styles.infoContainer}>
          <View style={styles.distanceRow}>
            <LocationIcon size={16} color="white" />
            <Text style={styles.distanceText}>{restaurant.distance} miles away</Text>
          </View>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

// Programmatic swipe (for button presses)
export function useSwipeCard() {
  const translateX = useSharedValue(0);

  const swipeRight = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    translateX.value = withSpring(SCREEN_WIDTH + 100, { damping: 15 }, () => {
      runOnJS(callback)();
    });
  };

  const swipeLeft = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    translateX.value = withSpring(-(SCREEN_WIDTH + 100), { damping: 15 }, () => {
      runOnJS(callback)();
    });
  };

  return { translateX, swipeRight, swipeLeft };
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    // Simulated gradient using absolute positioning
  },
  nopeIndicator: {
    position: "absolute",
    top: "33%",
    left: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: "rgba(248, 113, 113, 0.8)",
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    transform: [{ rotate: "-15deg" }],
  },
  nopeText: {
    color: "rgb(248, 113, 113)",
    fontSize: 20,
    fontWeight: "bold",
  },
  likeIndicator: {
    position: "absolute",
    top: "33%",
    right: 32,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 3,
    borderColor: "rgba(74, 222, 128, 0.8)",
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    transform: [{ rotate: "15deg" }],
  },
  likeText: {
    color: "rgb(74, 222, 128)",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 80,
    padding: 24,
    paddingBottom: 96,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  distanceText: {
    color: "white",
    fontSize: 14,
  },
  restaurantName: {
    color: "white",
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 4,
  },
  cuisineText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
});
