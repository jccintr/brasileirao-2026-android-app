# Brasileirão 2026

App em React Native / Expo (SDK 54) para acompanhar o Campeonato Brasileiro Série A, consumindo
a API [football-data.org](https://www.football-data.org) (competição `BSA`).

## Recursos

- Tema claro/escuro (automático pelo sistema, ou forçado manualmente, com preferência persistida)
- Classificação (tabela completa, com escudos, jogos, saldo de gols e pontos)
- Partidas por rodada (seletor de rodada 1–38)
- Lista de equipes com escudo, navegando para os jogos (próximos e resultados) de cada uma
- Cache leve em memória das chamadas à API (60s) pra não estourar o limite de requisições do plano
- Tratamento de erros de rede/API com opção de "tentar novamente"

## Configuração da API

Edite `src/config/env.js` e cole sua chave:

```js
export const API_TOKEN = "sua-chave-aqui";
```

Chave gratuita em https://www.football-data.org/client/register.

## Como rodar

Este projeto foi montado pra rodar 100% no **Expo Go** — sem dev build, sem prebuild — já que
não usa nenhuma lib nativa fora do que o próprio Expo Go já traz.

```bash
npm install
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens @react-native-async-storage/async-storage
npx expo start
```

Escaneie o QR code com o app **Expo Go** (Android ou iOS).

> Por que instalar as libs de navegação separadamente? Pra garantir que o `expo install` resolva
> exatamente as versões nativas compatíveis com o SDK 54 instalado — evita o tipo de conflito de
> versão (`expo-font`, `expo-modules-core`, etc.) que já pegamos em outros projetos. O
> `overrides` no `package.json` já trava o `expo-font` na versão certa por segurança; depois do
> `npm install` vale rodar `npm ls expo-font` pra conferir se não duplicou.

## Estrutura

```
App.js                          # ThemeProvider + SafeAreaProvider + RootNavigator
src/
  api/
    client.js                   # fetch + cache + mensagens de erro amigáveis
    football.js                 # endpoints da BSA (standings, matches, teams)
  config/
    env.js                      # API_TOKEN, temporada, total de rodadas
  theme/
    palettes.js                 # cores claro/escuro
    ThemeContext.js             # contexto + persistência (AsyncStorage)
  navigation/
    RootNavigator.js            # abas: Classificação, Rodadas, Equipes, Ajustes
  screens/
    StandingsScreen.js
    RoundsScreen.js
    TeamsScreen.js
    TeamDetailScreen.js
    SettingsScreen.js
  components/
    TeamCrest.js                # escudo com fallback de ícone
    MatchCard.js                # card de partida (placar/horário/status)
    LoadingState.js             # loading + erro com "tentar novamente"
assets/
  icon.png, adaptive-icon.png, splash-icon.png, favicon.png
```
