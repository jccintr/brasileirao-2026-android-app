// Faixas de posição da tabela do Brasileirão Série A e o que cada uma
// classifica/rebaixa para. Os números abaixo seguem o formato mais comum
// dos últimos anos (G4 direto + G2 pré-Libertadores, G6 Sul-Americana,
// Z4 rebaixamento numa liga de 20 clubes) — a CBF pode alterar as vagas
// de uma temporada pra outra (depende de campeões de Copa do Brasil,
// ranking da CONMEBOL etc.), então ajuste os números aqui se preciso,
// sem precisar mexer nas telas.
export function buildQualificationZones(colors) {
  return [
    {
      key: "libertadores-groups",
      label: "Libertadores (fase de grupos)",
      shortLabel: "Libertadores",
      from: 1,
      to: 4,
      color: colors.libertadores,
    },
    {
      key: "libertadores-pre",
      label: "Libertadores (pré-fase)",
      shortLabel: "Pré-Libertadores",
      from: 5,
      to: 5,
      color: colors.libertadoresPre,
    },
    {
      key: "sudamericana",
      label: "Sul-Americana",
      shortLabel: "Sul-Americana",
      from: 6,
      to: 11,
      color: colors.sudamericana,
    },
    {
      key: "relegation",
      label: "Rebaixamento",
      shortLabel: "Rebaixamento",
      from: 17,
      to: 20,
      color: colors.relegation,
    },
  ];
}

export function getZoneForPosition(zones, position) {
  return zones.find((zone) => position >= zone.from && position <= zone.to) ?? null;
}
