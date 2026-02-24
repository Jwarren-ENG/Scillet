import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withRepeat, withSequence, withSpring, withTiming, useSharedValue, runOnJS } from "react-native-reanimated";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import { SparklesIcon } from "../../src/components/Icons";
import * as Haptics from "expo-haptics";

export default function Ready() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userData, updateUserData } = useUser();
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 8 });
    opacity.value = withTiming(1, { duration: 400 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handleStart = () => {
    updateUserData({ completedOnboarding: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)/swipe");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
      <Animated.View style={[styles.content, animStyle]}>
        <View style={styles.iconContainer}>
          <SparklesIcon size={48} color="white" />
        </View>
        <Text style={styles.title}>You're all set, {userData.name}!</Text>
        <Text style={styles.subtitle}>Let's find some amazing food</Text>
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Start Swiping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  content: { alignItems: "center", width: "100%" },
  iconContainer: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#000", alignItems: "center", justifyContent: "center", marginBottom: 32 },
  title: { fontSize: 36, fontWeight: "600", color: "#000", textAlign: "center", marginBottom: 12 },
  subtitle: { fontSize: 18, color: "#666", textAlign: "center", marginBottom: 48 },
  button: { width: "100%", backgroundColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
