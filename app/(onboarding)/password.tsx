import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import * as Haptics from "expo-haptics";

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={{ height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 }}>
      <View style={{ height: 4, backgroundColor: "#000", borderRadius: 2, width: `${value}%` }} />
    </View>
  );
}

export default function Password() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();

  const isValid = password.length >= 8 && password === confirm;

  const handleContinue = () => {
    updateUserData({ password });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/permissions");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa", paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}>
        <ProgressBar value={62.5} />
        <View style={{ flex: 1, justifyContent: "center", gap: 12 }}>
          <Text style={{ fontSize: 32, fontWeight: "600", color: "#000", marginBottom: 8 }}>Create a password</Text>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 20 }}>At least 8 characters</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, backgroundColor: "#fff", color: "#000" }}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoFocus
          />
          <TextInput
            style={{ borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, backgroundColor: "#fff", color: "#000" }}
            placeholder="Confirm password"
            placeholderTextColor="#aaa"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
          {confirm.length > 0 && password !== confirm && (
            <Text style={{ color: "#ef4444", fontSize: 14, paddingLeft: 8 }}>Passwords don't match</Text>
          )}
        </View>
        <TouchableOpacity
          style={{ backgroundColor: isValid ? "#000" : "#ccc", borderRadius: 999, paddingVertical: 18, alignItems: "center" }}
          onPress={handleContinue}
          disabled={!isValid}
          activeOpacity={0.85}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
