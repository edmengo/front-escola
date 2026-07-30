import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { limparSessao, obterToken, salvarSessao, sessaoAtiva } from './api';

function storageFalso() {
  const dados = new Map<string, string>();
  return {
    getItem: (chave: string) => dados.get(chave) ?? null,
    setItem: (chave: string, valor: string) => dados.set(chave, valor),
    removeItem: (chave: string) => dados.delete(chave),
  };
}

describe('sessão', () => {
  beforeEach(() => vi.stubGlobal('localStorage', storageFalso()));
  afterEach(() => vi.unstubAllGlobals());

  it('salva e recupera um token opaco', () => {
    salvarSessao('token-da-api', { email: 'admin@escola.com' });
    expect(obterToken()).toBe('token-da-api');
    expect(sessaoAtiva()).toBe(true);
  });

  it('remove tokens JWT expirados', () => {
    const payload = btoa(JSON.stringify({ exp: 1 }));
    localStorage.setItem('token', `cabecalho.${payload}.assinatura`);
    localStorage.setItem('usuario', '{}');
    expect(sessaoAtiva()).toBe(false);
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('encerra a sessão por completo', () => {
    salvarSessao('token-da-api', { id: 1 });
    limparSessao();
    expect(obterToken()).toBeNull();
  });
});
