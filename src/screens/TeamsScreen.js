import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getTeams } from "../api/football";
import { useAppTheme } from "../theme/ThemeContext";
import { TeamCrest } from "../components/TeamCrest";
import { ScreenHeader } from "../components/ScreenHeader";
import { LoadingState, ErrorState } from "../components/LoadingState";

export function TeamsScreen({ navigation }) {
  const { colors } = useAppTheme();
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getTeams();
      const sorted = [...(data.teams ?? [])].sort((a, b) => a.name.localeCompare(b.name));
      setTeams(sorted);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Equipes" />
      {teams === null && !error && <LoadingState label="Carregando equipes..." />}
      {error && <ErrorState message={error} onRetry={load} />}
      {teams !== null && !error && (
        <FlatList
        data={teams}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() =>
              navigation.navigate("TeamDetail", {
                teamId: item.id,
                teamName: item.shortName || item.name,
              })
            }
          >
            <TeamCrest uri={item.crest} size={48} />
            <Text style={[styles.teamName, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.shortName || item.name}
            </Text>
          </Pressable>
        )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 12 },
  row: { gap: 12 },
  card: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    gap: 8,
    minHeight: 120,
    justifyContent: "center",
  },
  teamName: { fontSize: 13, fontWeight: "600", textAlign: "center" },
});
