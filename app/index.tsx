import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Logo placeholder */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <Text style={styles.title}>Scillet</Text>
        <Text style={styles.subtitle}>Discover food that's cooking nearby.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/(onboarding)/name")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  logoText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 48,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    fontSize: 14,
    color: "#888",
    textDecorationLine: "underline",
  },
});
