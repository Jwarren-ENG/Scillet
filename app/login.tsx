import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../src/context/UserContext";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userData, updateUserData } = useUser();

  const handleLogin = () => {
    if (contact === userData.contact && password === userData.password) {
      updateUserData({ completedOnboarding: true });
      router.replace("/(tabs)/swipe");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <TextInput
            style={styles.input}
            placeholder="Email or phone"
            placeholderTextColor="#aaa"
            value={contact}
            onChangeText={setContact}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, (!contact || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!contact || !password}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(onboarding)/name")}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
  },
  backButton: { paddingVertical: 8, marginBottom: 24 },
  backText: { fontSize: 16, color: "#000" },
  content: { flex: 1, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "600", marginBottom: 8, color: "#000" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  linkText: { textAlign: "center", color: "#888", textDecorationLine: "underline", fontSize: 14 },
});
