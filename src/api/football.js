import { apiRequest } from "./client";
import { COMPETITION_CODE, SEASON, COMPETITION_ID } from "../config/env";

export function getCompetitionInfo() {
  return apiRequest(`/competitions/${COMPETITION_CODE}`);
}

export function getStandings() {
  return apiRequest(`/competitions/${COMPETITION_CODE}/standings`);
}

export function getMatchesByMatchday(matchday) {
  return apiRequest(`/competitions/${COMPETITION_CODE}/matches?matchday=${matchday}`);
}

// Todas as partidas da temporada de uma vez (todas as rodadas). Usado pela
// tela de Rodadas pra permitir navegação por gesto/seleção sem precisar de
// uma chamada por rodada, e pra descobrir a rodada atual pela data.
export function getAllMatches() {
  return apiRequest(`/competitions/${COMPETITION_CODE}/matches`);
}

export function getTeams(season = SEASON) {
  return apiRequest(`/competitions/${COMPETITION_CODE}/teams?season=${season}`);
}

export function getTeamMatches(teamId) {
  return apiRequest(`/teams/${teamId}/matches/?competitions=${COMPETITION_ID}`);
}
