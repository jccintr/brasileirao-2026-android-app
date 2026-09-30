import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getStandings } from "../api/football";
import { useAppTheme } from "../theme/ThemeContext";
import { TeamCrest } from "../components/TeamCrest";
import { ZoneLegend } from "../components/ZoneLegend";
import { LoadingState, ErrorState } from "../components/LoadingState";
import { buildQualificationZones, getZoneForPosition } from "../config/qualificationZones";

export function StandingsScreen() {
  const { colors } = useAppTheme();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const zones = useMemo(() => buildQualificationZones(colors), [colors]);

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
      <ZoneLegend zones={zones} />

      <View style={[styles.headerRow, { borderColor: colors.border }]}>
        <View style={styles.zoneBarSpace} />
        <Text style={[styles.headerCell, styles.posCell, { color: colors.textMuted }]}>#</Text>
        <Text style={[styles.headerCell, styles.teamHeaderCell, { color: colors.textMuted }]}>Equipe</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>Pts</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>PJ</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>V</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>E</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>D</Text>
        <Text style={[styles.headerCell, styles.statCell, { color: colors.textMuted }]}>SG</Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.team.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => {
          const zone = getZoneForPosition(zones, item.position);
          return (
            <View style={[styles.row, { borderColor: colors.border }]}>
              <View style={[styles.zoneBar, { backgroundColor: zone?.color ?? "transparent" }]} />
              <Text style={[styles.posCell, styles.posText, { color: colors.textPrimary }]}>{item.position}</Text>
              <View style={styles.teamCellRow}>
                <TeamCrest uri={item.team.crest} size={22} />
                <Text style={[styles.teamName, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.team.shortName || item.team.name}
                </Text>
              </View>
              <Text style={[styles.statCell, styles.points, { color: colors.textPrimary }]}>{item.points}</Text>
              <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.playedGames}</Text>
              <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.won}</Text>
              <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.draw}</Text>
              <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.lost}</Text>
              <Text style={[styles.statCell, { color: colors.textSecondary }]}>{item.goalDifference}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const ZONE_BAR_WIDTH = 4;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingRight: 8, paddingVertical: 8, borderBottomWidth: 1 },
  headerCell: { fontSize: 10, fontWeight: "700" },
  zoneBarSpace: { width: ZONE_BAR_WIDTH, marginRight: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  zoneBar: { width: ZONE_BAR_WIDTH, alignSelf: "stretch", marginRight: 6, borderRadius: 2 },
  posCell: { width: 20 },
  posText: { fontWeight: "700", fontSize: 12 },
  teamHeaderCell: { flex: 1, marginLeft: 4 },
  teamCellRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6, marginLeft: 4 },
  teamName: { flex: 1, fontSize: 12.5, fontWeight: "500" },
  statCell: { width: 28, textAlign: "center", fontSize: 12 },
  points: { fontWeight: "700" },
});
