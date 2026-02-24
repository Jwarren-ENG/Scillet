import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
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

export default function ContactInfo() {
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"email" | "phone">("email");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();
  const isValid = contact.trim().length >= 5;

  const handleContinue = () => {
    updateUserData({ contact, contactType });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/password");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={[{ flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa" }, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
        <ProgressBar value={50} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ fontSize: 32, fontWeight: "600", marginBottom: 8, color: "#000" }}>Contact info</Text>
          <Text style={{ fontSize: 16, color: "#666", marginBottom: 32 }}>So you can log in later</Text>

          {/* Toggle */}
          <View style={{ flexDirection: "row", backgroundColor: "#f0f0f0", borderRadius: 999, padding: 4, marginBottom: 16 }}>
            {(["email", "phone"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={{ flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 999, backgroundColor: contactType === type ? "#000" : "transparent" }}
                onPress={() => setContactType(type)}
              >
                <Text style={{ color: contactType === type ? "#fff" : "#666", fontWeight: "500", textTransform: "capitalize" }}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={{ borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 999, paddingHorizontal: 20, paddingVertical: 16, fontSize: 16, backgroundColor: "#fff", color: "#000" }}
            placeholder={contactType === "email" ? "your@email.com" : "+1 (555) 000-0000"}
            placeholderTextColor="#aaa"
            value={contact}
            onChangeText={setContact}
            keyboardType={contactType === "email" ? "email-address" : "phone-pad"}
            autoCapitalize="none"
            autoFocus
          />
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
