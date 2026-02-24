import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import * as Haptics from "expo-haptics";

const preferences = [
  { name: "Burgers", emoji: "🍔" }, { name: "Sushi", emoji: "🍣" },
  { name: "Tacos", emoji: "🌮" }, { name: "Pizza", emoji: "🍕" },
  { name: "Desserts", emoji: "🍰" }, { name: "Street Food", emoji: "🥘" },
  { name: "Fine Dining", emoji: "🍽️" }, { name: "Asian", emoji: "🥢" },
  { name: "Italian", emoji: "🍝" }, { name: "Mexican", emoji: "🌯" },
  { name: "Seafood", emoji: "🦞" }, { name: "BBQ", emoji: "🍖" },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 }}>
      <View style={{ height: 4, backgroundColor: "#000", borderRadius: 2, width: `${value}%` }} />
    </View>
  );
}

export default function FoodPreferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();
  const allSelected = selected.length === preferences.length;

  const toggle = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]);
  };

  const toggleAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(allSelected ? [] : preferences.map((p) => p.name));
  };

  const handleContinue = () => {
    updateUserData({ foodPreferences: selected });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/ready");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <ProgressBar value={93.75} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What do you love?</Text>
        <Text style={styles.subtitle}>Select as many as you want</Text>

        <TouchableOpacity
          style={[styles.allButton, allSelected && styles.allButtonActive]}
          onPress={toggleAll}
          activeOpacity={0.85}
        >
          <Text style={styles.allButtonEmoji}>✨</Text>
          <Text style={[styles.allButtonText, allSelected && { color: "#fff" }]}>I like it all</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or choose specific types</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.grid}>
          {preferences.map((pref) => (
            <TouchableOpacity
              key={pref.name}
              style={[styles.gridItem, selected.includes(pref.name) && styles.gridItemActive]}
              onPress={() => toggle(pref.name)}
              activeOpacity={0.85}
            >
              <Text style={styles.gridEmoji}>{pref.emoji}</Text>
              <Text style={[styles.gridText, selected.includes(pref.name) && { color: "#fff" }]}>{pref.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={selected.length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa" },
  title: { fontSize: 32, fontWeight: "600", color: "#000", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 24 },
  allButton: { padding: 20, borderRadius: 24, borderWidth: 2, borderColor: "#e0e0e0", backgroundColor: "#fff", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 },
  allButtonActive: { backgroundColor: "#000", borderColor: "#000" },
  allButtonEmoji: { fontSize: 28 },
  allButtonText: { fontSize: 16, fontWeight: "600", color: "#000" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { fontSize: 13, color: "#aaa" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  gridItem: { width: "47%", padding: 20, borderRadius: 24, borderWidth: 2, borderColor: "#e0e0e0", backgroundColor: "#fff", alignItems: "flex-start" },
  gridItemActive: { backgroundColor: "#000", borderColor: "#000" },
  gridEmoji: { fontSize: 32, marginBottom: 8 },
  gridText: { fontSize: 14, fontWeight: "500", color: "#000" },
  button: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
