import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";

export function LoadingState({ label = "Carregando..." }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message, onRetry }) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={[styles.errorTitle, { color: colors.danger }]}>Não foi possível carregar</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && (
        <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={onRetry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  label: { marginTop: 12, fontSize: 14, textAlign: "center" },
  errorTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  retryButton: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "700" },
});
