import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as AppleAuthentication from "expo-apple-authentication";
import { useUser } from "../src/context/UserContext";

type Step = "home" | "email" | "phone" | "otp";

export default function Auth() {
  const { signIn, signUp, signInWithApple, signInWithGoogle, signInWithPhone, verifyOtp } =
    useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>("home");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const clearError = () => setError("");

  // ---------- Handlers ----------

  const handleApple = async () => {
    setLoading(true);
    clearError();
    const { error } = await signInWithApple();
    setLoading(false);
    if (error) setError(error.message ?? "Apple sign-in failed");
  };

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) setError(error.message ?? "Google sign-in failed");
  };

  const handleEmailSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    clearError();
    const { error } = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message ?? "Sign in failed");
    }
    // On success, onAuthStateChange in UserContext handles redirect
  };

  const handleSendOtp = async () => {
    if (!phone) return;
    setLoading(true);
    clearError();
    const normalized = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    const { error } = await signInWithPhone(normalized);
    setLoading(false);
    if (error) {
      setError(error.message ?? "Failed to send code");
    } else {
      setPhone(normalized);
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setLoading(true);
    clearError();
    const { error } = await verifyOtp(phone, otp);
    setLoading(false);
    if (error) setError(error.message ?? "Invalid code");
    // On success, onAuthStateChange handles redirect
  };

  // ---------- Render ----------

  const renderHome = () => (
    <>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>S</Text>
      </View>
      <Text style={styles.title}>Scillet</Text>
      <Text style={styles.subtitle}>Discover food that's cooking nearby.</Text>

      <View style={styles.buttonStack}>
        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={999}
            style={styles.appleButton}
            onPress={handleApple}
          />
        )}

        <TouchableOpacity style={styles.outlineButton} onPress={handleGoogle} activeOpacity={0.85}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.outlineButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => { clearError(); setStep("phone"); }}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonIcon}>📱</Text>
          <Text style={styles.outlineButtonText}>Sign in with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => { clearError(); setStep("email"); setIsSignUp(false); }}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonIcon}>✉️</Text>
          <Text style={styles.outlineButtonText}>Sign in with Email</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => { clearError(); setIsSignUp(true); setStep("email"); }}
        activeOpacity={0.7}
      >
        <Text style={styles.linkText}>New here? Create an account</Text>
      </TouchableOpacity>
    </>
  );

  const renderEmail = () => (
    <>
      <TouchableOpacity onPress={() => setStep("home")} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>{isSignUp ? "Create account" : "Welcome back"}</Text>
      <Text style={styles.formSubtitle}>
        {isSignUp ? "Sign up with your email" : "Sign in to your account"}
      </Text>

      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Your name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={isSignUp ? "new-password" : "password"}
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonLoading]}
        onPress={handleEmailSubmit}
        disabled={loading || !email || !password}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>{isSignUp ? "Create Account" : "Sign In"}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => { clearError(); setIsSignUp(!isSignUp); }}
        activeOpacity={0.7}
        style={{ marginTop: 16 }}
      >
        <Text style={styles.linkText}>
          {isSignUp ? "Already have an account? Sign in" : "No account? Create one"}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPhone = () => (
    <>
      <TouchableOpacity onPress={() => setStep("home")} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Enter your number</Text>
      <Text style={styles.formSubtitle}>We'll send you a verification code</Text>

      <TextInput
        style={styles.input}
        placeholder="+1 (555) 000-0000"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoFocus
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonLoading]}
        onPress={handleSendOtp}
        disabled={loading || !phone}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Send Code</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderOtp = () => (
    <>
      <TouchableOpacity onPress={() => setStep("phone")} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.formTitle}>Enter the code</Text>
      <Text style={styles.formSubtitle}>Sent to {phone}</Text>

      <TextInput
        style={[styles.input, styles.otpInput]}
        placeholder="000000"
        placeholderTextColor="#aaa"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonLoading]}
        onPress={handleVerifyOtp}
        disabled={loading || otp.length < 6}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryButtonText}>Verify Code</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSendOtp} activeOpacity={0.7} style={{ marginTop: 16 }}>
        <Text style={styles.linkText}>Resend code</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" />

        {step === "home" && renderHome()}
        {step === "email" && renderEmail()}
        {step === "phone" && renderPhone()}
        {step === "otp" && renderOtp()}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: { color: "#fff", fontSize: 44, fontWeight: "bold" },
  title: { fontSize: 36, fontWeight: "600", color: "#000", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 48 },

  buttonStack: { width: "100%", gap: 12, marginBottom: 24 },
  appleButton: { width: "100%", height: 56 },
  outlineButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    borderRadius: 999,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  googleG: { fontSize: 18, fontWeight: "700", color: "#4285F4" },
  buttonIcon: { fontSize: 18 },
  outlineButtonText: { fontSize: 15, fontWeight: "500", color: "#000" },

  primaryButton: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonLoading: { opacity: 0.6 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  backButton: { alignSelf: "flex-start", paddingVertical: 8, marginBottom: 24 },
  backText: { fontSize: 16, color: "#000" },

  formTitle: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  formSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
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
  otpInput: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 8,
  },

  linkText: { fontSize: 14, color: "#888", textDecorationLine: "underline", textAlign: "center" },
  errorText: { color: "#ef4444", fontSize: 14, textAlign: "center", marginTop: 12 },
});
