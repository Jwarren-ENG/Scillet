import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import { CheckIcon } from "../../src/components/Icons";
import * as Haptics from "expo-haptics";

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

export default function NameInput() {
  const [name, setName] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();
  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    updateUserData({ name });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/username");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <ProgressBar value={12.5} />

        <View style={styles.content}>
          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.subtitle}>Let's get to know you</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            {isValid && (
              <View style={styles.checkBadge}>
                <CheckIcon size={16} color="white" />
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa" },
  progressTrack: { height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 },
  progressFill: { height: 4, backgroundColor: "#000", borderRadius: 2 },
  content: { flex: 1, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "600", marginBottom: 8, color: "#000" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 32 },
  inputWrapper: { position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 52,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  checkBadge: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
