import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { LocationIcon, BellIcon, CheckIcon } from "../../src/components/Icons";

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 }}>
      <View style={{ height: 4, backgroundColor: "#000", borderRadius: 2, width: `${value}%` }} />
    </View>
  );
}

function PermissionCard({
  icon, title, subtitle, granted, onEnable,
}: { icon: React.ReactNode; title: string; subtitle: string; granted: boolean; onEnable: () => void }) {
  return (
    <View style={[styles.card, granted && styles.cardGranted]}>
      <View style={[styles.iconBg, granted && styles.iconBgGranted]}>
        {granted ? <CheckIcon size={24} color="#fff" /> : icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        {!granted && (
          <TouchableOpacity style={styles.enableButton} onPress={onEnable} activeOpacity={0.85}>
            <Text style={styles.enableButtonText}>Enable</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function Permissions() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleEnableLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationGranted(status === "granted");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEnableNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationsGranted(status === "granted");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <ProgressBar value={75} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.title}>A couple permissions</Text>
        <Text style={styles.subtitle}>To make your experience great</Text>

        <View style={{ gap: 12 }}>
          <PermissionCard
            icon={<LocationIcon size={24} color="#000" />}
            title="Location"
            subtitle="So we can notify you when you're nearby"
            granted={locationGranted}
            onEnable={handleEnableLocation}
          />
          <PermissionCard
            icon={<BellIcon size={24} color="#000" />}
            title="Notifications"
            subtitle="So you don't miss food you saved"
            granted={notificationsGranted}
            onEnable={handleEnableNotifications}
          />
        </View>
      </View>

      {locationGranted && notificationsGranted ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(onboarding)/dietary")}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ gap: 8 }}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push("/(onboarding)/dietary")}
            activeOpacity={0.85}
          >
            <Text style={styles.outlineButtonText}>Skip for now</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: "center", color: "#aaa", fontSize: 12 }}>
            Limited functionality without permissions
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa" },
  title: { fontSize: 32, fontWeight: "600", color: "#000", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 32 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  cardGranted: { borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.08)" },
  iconBg: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  iconBgGranted: { backgroundColor: "#22c55e" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: "#666" },
  enableButton: { marginTop: 12, backgroundColor: "#000", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "flex-start" },
  enableButtonText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  button: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  outlineButton: { borderWidth: 1.5, borderColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  outlineButtonText: { color: "#000", fontSize: 16, fontWeight: "600" },
});
