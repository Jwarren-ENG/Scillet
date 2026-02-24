import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import * as Haptics from "expo-haptics";

const restrictions = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten Free", "Dairy Free", "Nut Allergy", "Shellfish Allergy"];

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 }}>
      <View style={{ height: 4, backgroundColor: "#000", borderRadius: 2, width: `${value}%` }} />
    </View>
  );
}

export default function DietaryRestrictions() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();

  const toggle = (item: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]);
  };

  const handleContinue = () => {
    updateUserData({ dietaryRestrictions: selected });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/preferences");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <ProgressBar value={87.5} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Any dietary needs?</Text>
        <Text style={styles.subtitle}>We'll filter accordingly</Text>

        <TouchableOpacity
          style={[styles.allButton, selected.length === 0 && styles.allButtonActive]}
          onPress={() => setSelected([])}
          activeOpacity={0.85}
        >
          <Text style={styles.allButtonEmoji}>🍽️</Text>
          <Text style={[styles.allButtonText, selected.length === 0 && { color: "#fff" }]}>I eat everything</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or select restrictions</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.tags}>
          {restrictions.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tag, selected.includes(item) && styles.tagActive]}
              onPress={() => toggle(item)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tagText, selected.includes(item) && { color: "#fff" }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.85}>
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
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  tag: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999, borderWidth: 2, borderColor: "#e0e0e0", backgroundColor: "#fff" },
  tagActive: { backgroundColor: "#000", borderColor: "#000" },
  tagText: { fontSize: 15, color: "#000", fontWeight: "500" },
  button: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
