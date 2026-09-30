import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "../theme/ThemeContext";

// Header próprio em JS, usado no lugar do header nativo do native-stack.
// O header nativo (renderizado pelo react-native-screens) não estava
// respeitando o inset da status bar no Android com edge-to-edge — esse aqui
// aplica o inset manualmente, do mesmo jeito que já resolvemos nas sheets.
export function ScreenHeader({ title, onBack }) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: colors.headerBackground }}>
      <View style={styles.row}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.headerText} />
          </Pressable>
        )}
        <Text style={[styles.title, { color: colors.headerText }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
}

const HEADER_HEIGHT = 56;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 12, marginLeft: -6 },
  title: { flex: 1, fontSize: 20, fontWeight: "700" },
});
