import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

export function ZoneLegend({ zones }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      {zones.map((zone) => (
        <View key={zone.key} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: zone.color }]} />
          <Text style={[styles.label, { color: colors.textSecondary }]}>{zone.shortLabel}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 10, fontWeight: "600" },
});
