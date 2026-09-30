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

export function getTeams(season = SEASON) {
  return apiRequest(`/competitions/${COMPETITION_CODE}/teams?season=${season}`);
}

export function getTeamMatches(teamId) {
  return apiRequest(`/teams/${teamId}/matches/?competitions=${COMPETITION_ID}`);
}
