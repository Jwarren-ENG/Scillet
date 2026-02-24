import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeIcon, MapIcon, SavedIcon, ProfileIcon } from "../../src/components/Icons";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "rgba(255,255,255,0.1)",
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: { fontSize: 10, marginBottom: 4 },
      }}
    >
      <Tabs.Screen
        name="swipe"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <MapIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <SavedIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <ProfileIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
