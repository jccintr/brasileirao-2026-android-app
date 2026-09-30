import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/ThemeContext";
import { API_TOKEN } from "../config/env";

const OPTIONS = [
  { key: "system", label: "Automático (sistema)", icon: "phone-portrait-outline" },
  { key: "light", label: "Claro", icon: "sunny-outline" },
  { key: "dark", label: "Escuro", icon: "moon-outline" },
];

export function SettingsScreen() {
  const { colors, preference, setThemePreference } = useAppTheme();
  const tokenMissing = !API_TOKEN || API_TOKEN === "COLOQUE_SUA_CHAVE_AQUI";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APARÊNCIA</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {OPTIONS.map((opt, idx) => (
          <Pressable
            key={opt.key}
            onPress={() => setThemePreference(opt.key)}
            style={[
              styles.row,
              idx < OPTIONS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
            ]}
          >
            <Ionicons name={opt.icon} size={20} color={colors.textPrimary} />
            <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{opt.label}</Text>
            {preference === opt.key && <Ionicons name="checkmark" size={20} color={colors.primary} />}
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SOBRE OS DADOS</Text>
      <View style={[styles.card, styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.paragraph, { color: colors.textSecondary }]}>
          Dados fornecidos por football-data.org — competição BSA (Campeonato Brasileiro Série A).
        </Text>
        {tokenMissing && (
          <Text style={[styles.paragraph, styles.warning, { color: colors.danger }]}>
            Nenhuma chave de API configurada. Edite src/config/env.js e defina API_TOKEN com sua
            chave gratuita de football-data.org/client/register.
          </Text>
        )}
        <Pressable onPress={() => Linking.openURL("https://www.football-data.org")}>
          <Text style={[styles.link, { color: colors.primary }]}>football-data.org</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "700", marginBottom: 8, marginTop: 8 },
  card: { borderRadius: 14, borderWidth: 1, marginBottom: 20, overflow: "hidden" },
  infoCard: { padding: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  paragraph: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  warning: { fontWeight: "600" },
  link: { fontSize: 13, fontWeight: "700", marginTop: 4 },
});
