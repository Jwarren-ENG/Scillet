import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import { foodCategories } from "../data/restaurants";
import { CloseIcon } from "./Icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
}

export function FilterBottomSheet({ visible, onClose, selectedCategory, setSelectedCategory }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
      </TouchableOpacity>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter by Category</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseIcon size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {foodCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
                onPress={() => { setSelectedCategory(cat.id); onClose(); }}
                activeOpacity={0.85}
              >
                <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                <Text style={[styles.chipText, selectedCategory === cat.id && { color: "#fff" }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
    maxHeight: "60%",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "600", color: "#000" },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f0f0f0", alignItems: "center", justifyContent: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1.5, borderColor: "#e0e0e0", backgroundColor: "#fff" },
  chipActive: { backgroundColor: "#000", borderColor: "#000" },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 14, fontWeight: "500", color: "#000" },
});
