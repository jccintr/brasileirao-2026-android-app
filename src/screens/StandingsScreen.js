import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getStandings } from "../api/football";
import { useAppTheme } from "../theme/ThemeContext";
import { TeamCrest } from "../components/TeamCrest";
import { LoadingState, ErrorState } from "../components/LoadingState";

export function StandingsScreen() {
  const { colors } = useAppTheme();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getStandings();
      const total = data.standings?.find((g) => g.type === "TOTAL") ?? data.standings?.[0];
      setRows(total?.table ?? []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (rows === null && !error) return <LoadingState label="Carregando classificação..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <View style={[styles.headerRow, { borderColor: colors.border }]}>
        <Text style={[styles.headerCell, styles.posCell, { color: colors.textMuted }]}>#</Text>
        <Text style={[styles.headerCell, styles.teamHeaderCell, { color: colors.textMuted }]}>Equipe</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>PJ</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>SG</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>Pts</Text>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.team.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.border }]}>
            <Text style={[styles.posCell, styles.posText, { color: colors.textPrimary }]}>{item.position}</Text>
            <View style={styles.teamCellRow}>
              <TeamCrest uri={item.team.crest} size={24} />
              <Text style={[styles.teamName, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.team.shortName || item.team.name}
              </Text>
            </View>
            <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.playedGames}</Text>
            <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.goalDifference}</Text>
            <Text style={[styles.statCell, styles.points, { color: colors.textPrimary }]}>{item.points}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1 },
  headerCell: { fontSize: 11, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  posCell: { width: 24 },
  posText: { fontWeight: "700" },
  teamHeaderCell: { flex: 1 },
  teamCellRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  teamName: { flex: 1, fontSize: 14, fontWeight: "500" },
  statCell: { width: 36, textAlign: "center", fontSize: 13 },
  points: { fontWeight: "700" },
});
