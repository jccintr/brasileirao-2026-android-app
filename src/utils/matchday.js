const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Agrupa as partidas por rodada, ordenadas por data dentro de cada rodada.
export function groupMatchesByRound(matches) {
  const byRound = new Map();
  for (const match of matches) {
    if (match.matchday == null) continue;
    if (!byRound.has(match.matchday)) byRound.set(match.matchday, []);
    byRound.get(match.matchday).push(match);
  }
  for (const list of byRound.values()) {
    list.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  }
  return byRound;
}

// Descobre a rodada "atual": a que está em andamento na data de hoje, ou,
// se não tiver nenhuma em andamento, a próxima rodada agendada. Se a
// temporada já tiver terminado, cai pra última rodada. Usado como posição
// inicial da tela de Rodadas, já que a API não expõe isso diretamente por
// rodada (só currentSeason.currentMatchday no endpoint da competição, que
// pode vir nulo fora de temporada).
export function computeCurrentMatchday(matches, fallback = 1) {
  if (!matches || matches.length === 0) return fallback;

  const byRound = groupMatchesByRound(matches);
  const rounds = [...byRound.entries()]
    .map(([day, list]) => {
      const times = list.map((m) => new Date(m.utcDate).getTime());
      return { day, min: Math.min(...times), max: Math.max(...times) };
    })
    .sort((a, b) => a.day - b.day);

  if (rounds.length === 0) return fallback;

  const now = Date.now();

  const ongoing = rounds.find((r) => now >= r.min - ONE_DAY_MS && now <= r.max + ONE_DAY_MS);
  if (ongoing) return ongoing.day;

  const next = rounds.find((r) => r.min > now);
  if (next) return next.day;

  return rounds[rounds.length - 1].day;
}
