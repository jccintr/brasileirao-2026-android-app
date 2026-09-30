import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../theme/ThemeContext";
import { TeamCrest } from "./TeamCrest";

const STATUS_LABELS = {
  SCHEDULED: "Agendado",
  TIMED: "Agendado",
  IN_PLAY: "Ao vivo",
  PAUSED: "Intervalo",
  FINISHED: "Encerrado",
  POSTPONED: "Adiado",
  SUSPENDED: "Suspenso",
  CANCELLED: "Cancelado",
  AWARDED: "Decidido em gabinete",
};

function formatDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

export function MatchCard({ match, onPress }) {
  const { colors } = useAppTheme();
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const home = match.score?.fullTime?.home;
  const away = match.score?.fullTime?.away;
  const hasScore = home !== null && home !== undefined && away !== null && away !== undefined;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {match.matchday ? `Rodada ${match.matchday} · ` : ""}
          {formatDateTime(match.utcDate)}
        </Text>
        <Text style={[styles.status, { color: isLive ? colors.danger : colors.textMuted }]}>
          {isLive ? "● AO VIVO" : STATUS_LABELS[match.status] ?? match.status}
        </Text>
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamBlock}>
          <TeamCrest uri={match.homeTeam?.crest} size={28} />
          <Text style={[styles.teamName, { color: colors.textPrimary }]} numberOfLines={2}>
            {match.homeTeam?.shortName || match.homeTeam?.name || "?"}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          {hasScore || isLive ? (
            <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
              {home ?? 0} - {away ?? 0}
            </Text>
          ) : (
            <Text style={[styles.vsText, { color: colors.textMuted }]}>vs</Text>
          )}
        </View>

        <View style={styles.teamBlock}>
          <TeamCrest uri={match.awayTeam?.crest} size={28} />
          <Text style={[styles.teamName, { color: colors.textPrimary }]} numberOfLines={2}>
            {match.awayTeam?.shortName || match.awayTeam?.name || "?"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 10 },
  topRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, gap: 8 },
  meta: { fontSize: 11, flexShrink: 1 },
  status: { fontSize: 11, fontWeight: "700" },
  teamsRow: { flexDirection: "row", alignItems: "center" },
  teamBlock: { flex: 1, alignItems: "center", gap: 4 },
  teamName: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  scoreBox: { width: 64, alignItems: "center", justifyContent: "center" },
  scoreText: { fontSize: 18, fontWeight: "800" },
  vsText: { fontSize: 13, fontWeight: "600" },
});
