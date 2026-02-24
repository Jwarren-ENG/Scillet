import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { BlurView } from "expo-blur";
import { cities } from "../data/restaurants";
import { CloseIcon } from "./Icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  radius: number;
  setRadius: (r: number) => void;
}

export function LocationBottomSheet({ visible, onClose, selectedCity, setSelectedCity, radius, setRadius }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      </TouchableOpacity>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Location</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseIcon size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>City</Text>
        <View style={styles.cityList}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city.id}
              style={[styles.cityChip, selectedCity === city.id && styles.cityChipActive]}
              onPress={() => setSelectedCity(city.id)}
              activeOpacity={0.85}
            >
              <Text style={styles.cityEmoji}>{city.emoji}</Text>
              <Text style={[styles.cityText, selectedCity === city.id && { color: "#fff" }]}>{city.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Radius: {radius} miles</Text>
        <Slider
          style={{ marginHorizontal: -8, marginBottom: 8 }}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={radius}
          onValueChange={setRadius}
          minimumTrackTintColor="#000"
          maximumTrackTintColor="#e0e0e0"
          thumbTintColor="#000"
        />

        <TouchableOpacity style={styles.applyButton} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    zIndex: 2,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "600", color: "#000" },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 12 },
  cityList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  cityChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5, borderColor: "#e0e0e0" },
  cityChipActive: { backgroundColor: "#000", borderColor: "#000" },
  cityEmoji: { fontSize: 14 },
  cityText: { fontSize: 14, fontWeight: "500", color: "#000" },
  applyButton: { backgroundColor: "#000", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  applyButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
