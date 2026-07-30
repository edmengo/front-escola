import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'token';
const USER_KEY = 'usuario';

export interface Usuario {
  id?: number;
  nome?: string;
  email?: string;
}

interface JwtPayload {
  exp?: number;
}

function tokenExpirado(token: string): boolean {
  if (token.split('.').length !== 3) return false;
  try {
    const partePayload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(partePayload.padEnd(Math.ceil(partePayload.length / 4) * 4, '='))) as JwtPayload;
    return payload.exp !== undefined && payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

export function obterToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || tokenExpirado(token)) {
    limparSessao();
    return null;
  }
  return token;
}

export function sessaoAtiva(): boolean {
  return Boolean(obterToken());
}

export function salvarSessao(token: string, usuario: Usuario | undefined): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario ?? {}));
}

export function limparSessao(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.codeapps.com.br',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = obterToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/login')) {
      limparSessao();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function mensagemErro(error: unknown, padrao = 'Não foi possível concluir a operação.'): string {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.error ?? error.response?.data?.message ?? padrao;
  }
  return error instanceof Error ? error.message : padrao;
}
