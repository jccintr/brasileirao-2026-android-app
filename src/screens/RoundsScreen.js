import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getAllMatches, getCompetitionInfo } from "../api/football";
import { TOTAL_MATCHDAYS } from "../config/env";
import { useAppTheme } from "../theme/ThemeContext";
import { MatchCard } from "../components/MatchCard";
import { RoundPickerModal } from "../components/RoundPickerModal";
import { LoadingState, ErrorState } from "../components/LoadingState";
import { computeCurrentMatchday, groupMatchesByRound } from "../utils/matchday";

const PAGE_WIDTH = Dimensions.get("window").width;

function RoundPage({ round, matches, colors }) {
  return (
    <View style={{ width: PAGE_WIDTH }}>
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
    </View>
  );
}

export function RoundsScreen() {
  const { colors } = useAppTheme();
  const listRef = useRef(null);

  const [allMatches, setAllMatches] = useState(null);
  const [initialRound, setInitialRound] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [error, setError] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setAllMatches(null);
    setInitialRound(null);
    setSelectedRound(null);
    try {
      const [competition, matchesData] = await Promise.all([
        getCompetitionInfo().catch(() => null),
        getAllMatches(),
      ]);
      const matches = matchesData.matches ?? [];

      const apiCurrentMatchday = competition?.currentSeason?.currentMatchday;
      const startRound =
        typeof apiCurrentMatchday === "number" && apiCurrentMatchday > 0
          ? apiCurrentMatchday
          : computeCurrentMatchday(matches, 1);

      setAllMatches(matches);
      setInitialRound(startRound);
      setSelectedRound(startRound);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byRound = useMemo(() => (allMatches ? groupMatchesByRound(allMatches) : new Map()), [allMatches]);

  const totalRounds = useMemo(() => {
    const maxFromData = byRound.size > 0 ? Math.max(...byRound.keys()) : 0;
    return Math.max(TOTAL_MATCHDAYS, maxFromData);
  }, [byRound]);

  const rounds = useMemo(() => Array.from({ length: totalRounds }, (_, i) => i + 1), [totalRounds]);

  const scrollToRound = useCallback((round, animated = true) => {
    listRef.current?.scrollToIndex({ index: round - 1, animated });
  }, []);

  const goTo = useCallback(
    (delta) => {
      setSelectedRound((prev) => {
        const next = Math.min(totalRounds, Math.max(1, prev + delta));
        scrollToRound(next);
        return next;
      });
    },
    [totalRounds, scrollToRound]
  );

  const handlePickRound = useCallback(
    (round) => {
      setPickerVisible(false);
      setSelectedRound(round);
      scrollToRound(round, false);
    },
    [scrollToRound]
  );

  const onMomentumScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    setSelectedRound(index + 1);
  }, []);

  const getItemLayout = useCallback(
    (_data, index) => ({ length: PAGE_WIDTH, offset: PAGE_WIDTH * index, index }),
    []
  );

  if (allMatches === null && !error) return <LoadingState label="Carregando rodadas..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["left", "right"]}>
      <View style={[styles.selector, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable onPress={() => goTo(-1)} disabled={selectedRound <= 1} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={selectedRound <= 1 ? colors.textMuted : colors.primary} />
        </Pressable>

        <Pressable style={styles.selectorLabelButton} onPress={() => setPickerVisible(true)} hitSlop={8}>
          <Text style={[styles.selectorLabel, { color: colors.textPrimary }]}>Rodada {selectedRound}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
        </Pressable>

        <Pressable onPress={() => goTo(1)} disabled={selectedRound >= totalRounds} hitSlop={12}>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={selectedRound >= totalRounds ? colors.textMuted : colors.primary}
          />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={rounds}
        keyExtractor={(item) => String(item)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialRound ? initialRound - 1 : 0}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => <RoundPage round={item} matches={byRound.get(item) ?? []} colors={colors} />}
        // Se o usuário arrastar antes do layout assentar, o RN pode falhar o
        // scroll inicial pro índice calculado; isso recupera automaticamente.
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: false });
          }, 50);
        }}
      />

      <RoundPickerModal
        visible={pickerVisible}
        totalRounds={totalRounds}
        selectedRound={selectedRound}
        onSelect={handlePickRound}
        onClose={() => setPickerVisible(false)}
      />
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
  selectorLabelButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  selectorLabel: { fontSize: 16, fontWeight: "700" },
  list: { padding: 12 },
  empty: { textAlign: "center", marginTop: 40, fontSize: 13 },
});
