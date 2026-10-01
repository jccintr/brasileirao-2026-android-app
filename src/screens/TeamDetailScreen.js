import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SectionList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getTeamMatches } from "../api/football";
import { useAppTheme } from "../theme/ThemeContext";
import { MatchCard } from "../components/MatchCard";
import { ScreenHeader } from "../components/ScreenHeader";
import { LoadingState, ErrorState } from "../components/LoadingState";

export function TeamDetailScreen({ route, navigation }) {
  const { teamId, teamName } = route.params;
  const { colors } = useAppTheme();
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getTeamMatches(teamId);
      setMatches(data.matches ?? []);
    } catch (e) {
      setError(e.message);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  const sections = useMemo(() => {
    if (!matches) return [];
    const now = Date.now();
    const isUpcoming = (m) =>
      m.status === "SCHEDULED" || m.status === "TIMED" || new Date(m.utcDate).getTime() >= now;

    const upcoming = matches.filter(isUpcoming).sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
    const past = matches.filter((m) => !isUpcoming(m)).sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

    return [
      { title: "Próximos jogos", data: upcoming },
      { title: "Últimos resultados", data: past },
    ].filter((s) => s.data.length > 0);
  }, [matches]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <ScreenHeader title={teamName ?? "Equipe"} onBack={() => navigation.goBack()} />
      {matches === null && !error && <LoadingState label="Carregando jogos..." />}
      {error && <ErrorState message={error} onRetry={load} />}
      {matches !== null && !error && (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, backgroundColor: colors.background }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => <MatchCard match={item} />}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textMuted }]}>Nenhuma partida encontrada.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", paddingVertical: 8 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 13 },
});
