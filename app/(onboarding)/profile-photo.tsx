import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../src/context/UserContext";
import { CameraIcon } from "../../src/components/Icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
}

export default function ProfilePhoto() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUserData } = useUser();

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleContinue = () => {
    if (photoUri) updateUserData({ profilePhoto: photoUri });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(onboarding)/contact");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <ProgressBar value={37.5} />

      <View style={styles.content}>
        <Text style={styles.title}>Add a profile photo</Text>
        <Text style={styles.subtitle}>Let others see your face (optional)</Text>

        <TouchableOpacity style={styles.avatarButton} onPress={handlePickImage} activeOpacity={0.85}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <CameraIcon size={40} color="#aaa" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Choose a clear photo where your face is visible. You can always change this later.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, !photoUri && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!photoUri}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={() => router.push("/(onboarding)/contact")}>
          <Text style={styles.ghostButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: "#fafafa" },
  progressTrack: { height: 4, backgroundColor: "#e0e0e0", borderRadius: 2, marginBottom: 32 },
  progressFill: { height: 4, backgroundColor: "#000", borderRadius: 2 },
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "600", marginBottom: 8, color: "#000", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 48, textAlign: "center" },
  avatarButton: { marginBottom: 24 },
  avatar: { width: 160, height: 160, borderRadius: 80, borderWidth: 4, borderColor: "#000" },
  avatarPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f0f0f0",
    borderWidth: 4,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addPhotoText: { fontSize: 12, color: "#888", fontWeight: "600" },
  hint: { fontSize: 12, color: "#888", textAlign: "center", maxWidth: 280 },
  buttons: { gap: 12 },
  button: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 18, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#ccc" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  ghostButton: { paddingVertical: 18, alignItems: "center" },
  ghostButtonText: { color: "#888", fontSize: 16 },
});
