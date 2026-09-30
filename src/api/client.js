import { API_BASE_URL, API_TOKEN } from "../config/env";

// Cache simples em memória (por URL) pra evitar bater na API repetidamente
// ao trocar de aba/tela rapidamente. O plano gratuito da football-data.org
// tem limite de requisições por minuto, então isso ajuda a não estourar.
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function friendlyMessage(status) {
  switch (status) {
    case 400:
      return "Requisição inválida (parâmetro incorreto).";
    case 403:
      return "Acesso negado pela API. Confira se a chave em src/config/env.js está correta e se o seu plano cobre esse recurso.";
    case 404:
      return "Recurso não encontrado.";
    case 429:
      return "Muitas requisições em pouco tempo. Aguarde um instante e tente novamente.";
    default:
      return `A API retornou um erro (código ${status}).`;
  }
}

export async function apiRequest(path, { skipCache = false } = {}) {
  const cached = cache.get(path);
  if (!skipCache && cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "X-Auth-Token": API_TOKEN },
    });
  } catch (networkError) {
    throw new Error("Não foi possível conectar à API. Verifique sua conexão com a internet.");
  }

  if (!response.ok) {
    const error = new Error(friendlyMessage(response.status));
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  cache.set(path, { data, time: Date.now() });
  return data;
}

export function clearApiCache() {
  cache.clear();
}
