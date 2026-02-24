import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUser } from "../src/context/UserContext";
import Toast from "react-native-toast-message";
import "../global.css";

function RootLayoutNav() {
  const { session, userData, isLoading } = useUser();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === "auth";
    const inOnboarding = segments[0] === "(onboarding)";
    const inTabs = segments[0] === "(tabs)";
    const inRestaurant = segments[0] === "restaurant";
    const inFriends = segments[0] === "friends";

    if (!session) {
      // No session — send to auth
      if (!inAuth) router.replace("/auth");
    } else if (!userData.completedOnboarding) {
      // Authenticated but hasn't finished onboarding
      if (!inOnboarding) router.replace("/(onboarding)/name");
    } else {
      // Fully authenticated — send to tabs if not already there
      if (!inTabs && !inRestaurant && !inFriends) {
        router.replace("/(tabs)/swipe");
      }
    }
  }, [session, userData.completedOnboarding, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="friends" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UserProvider>
          <RootLayoutNav />
          <Toast />
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
