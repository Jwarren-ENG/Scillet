import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUser } from "../src/context/UserContext";
import Toast from "react-native-toast-message";
import "../global.css";

function RootLayoutNav() {
  const { userData, isLoading } = useUser();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (userData.completedOnboarding && !inTabsGroup) {
      router.replace("/(tabs)/swipe");
    } else if (!userData.completedOnboarding && inTabsGroup) {
      router.replace("/");
    }
  }, [userData.completedOnboarding, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="restaurant/[id]" />
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
