import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "../theme/ThemeContext";

export function RoundPickerModal({ visible, totalRounds, selectedRound, onSelect, onClose }) {
  const { colors } = useAppTheme();
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <SafeAreaView
          edges={["bottom"]}
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Selecionar rodada</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={rounds}
            keyExtractor={(item) => String(item)}
            numColumns={5}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => {
              const isSelected = item === selectedRound;
              return (
                <Pressable
                  onPress={() => onSelect(item)}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.cellText, { color: isSelected ? "#FFFFFF" : colors.textPrimary }]}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 16, fontWeight: "700" },
  grid: { paddingHorizontal: 14, paddingBottom: 20, gap: 10 },
  cell: {
    flex: 1,
    margin: 5,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: { fontSize: 14, fontWeight: "700" },
});
