import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getMatchesByMatchday } from "../api/football";
import { TOTAL_MATCHDAYS } from "../config/env";
import { useAppTheme } from "../theme/ThemeContext";
import { MatchCard } from "../components/MatchCard";
import { LoadingState, ErrorState } from "../components/LoadingState";

export function RoundsScreen() {
  const { colors } = useAppTheme();
  const [matchday, setMatchday] = useState(1);
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async (day) => {
    setMatches(null);
    setError(null);
    try {
      const data = await getMatchesByMatchday(day);
      setMatches(data.matches ?? []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load(matchday);
  }, [matchday, load]);

  const goTo = (delta) => {
    setMatchday((prev) => Math.min(TOTAL_MATCHDAYS, Math.max(1, prev + delta)));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <View style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => goTo(-1)} disabled={matchday <= 1} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={matchday <= 1 ? colors.textMuted : colors.primary} />
        </Pressable>
        <Text style={[styles.selectorLabel, { color: colors.textPrimary }]}>Rodada {matchday}</Text>
        <Pressable onPress={() => goTo(1)} disabled={matchday >= TOTAL_MATCHDAYS} hitSlop={12}>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={matchday >= TOTAL_MATCHDAYS ? colors.textMuted : colors.primary}
          />
        </Pressable>
      </View>

      {matches === null && !error && <LoadingState label={`Carregando rodada ${matchday}...`} />}
      {error && <ErrorState message={error} onRetry={() => load(matchday)} />}
      {matches !== null && !error && (
        <FlatList
          data={matches}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MatchCard match={item} />}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              Nenhuma partida encontrada para essa rodada.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectorLabel: { fontSize: 16, fontWeight: "700" },
  list: { padding: 12 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 13 },
});
