import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro, salvarSessao, type Usuario } from '../api';
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  usuario?: Usuario;
  message?: string;
  mfaRequired?: boolean;
  tokenDesafio?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenDesafio, setTokenDesafio] = useState('');
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/login', { email, senha });
      if (data.mfaRequired && data.tokenDesafio) {
        setTokenDesafio(data.tokenDesafio);
        setSenha('');
        toast.success('Senha confirmada. Informe o código do autenticador.');
        return;
      }
      const token = data.token ?? data.accessToken;
      if (!token) throw new Error('A API não retornou um token de acesso.');

      salvarSessao(token, data.usuario);
      toast.success(data.message ?? 'Login realizado com sucesso!');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      toast.error(mensagemErro(error, 'Não foi possível realizar o login.'));
    } finally {
      setLoading(false);
    }
  };

  const confirmarMfa = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/login/mfa', { tokenDesafio, codigo });
      const token = data.token ?? data.accessToken;
      if (!token) throw new Error('A API não retornou um token de acesso.');
      salvarSessao(token, data.usuario);
      toast.success(data.message ?? 'Login realizado com sucesso!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(mensagemErro(error, 'Código inválido ou expirado.'));
    } finally {
      setLoading(false);
    }
  };

  const entrarComPasskey = async () => {
    if (!email) return toast.error('Informe seu e-mail para localizar a passkey.');
    if (!browserSupportsWebAuthn()) return toast.error('Este navegador não suporta passkeys.');
    setLoading(true);
    try {
      const { data } = await api.post('/login/passkey/opcoes', { email });
      const response = await startAuthentication({ optionsJSON: data.options });
      const login = await api.post<LoginResponse>('/login/passkey/confirmar', { challengeId: data.challengeId, response });
      const token = login.data.token ?? login.data.accessToken;
      if (!token) throw new Error('A API não retornou um token de acesso.');
      salvarSessao(token, login.data.usuario);
      toast.success('Login realizado com passkey.');
      navigate('/', { replace: true });
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível autenticar com a passkey.')); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <section className="login-aside"><div className="login-brand"><span>E</span><strong>Escola</strong></div><div className="login-message"><span className="section-kicker">GESTÃO EDUCACIONAL</span><h1>Uma gestão mais simples, decisões mais seguras.</h1><p>Centralize entidades, cursos e alunos em uma única plataforma de administração.</p></div><div className="login-footer">© {new Date().getFullYear()} Escola Gestão · Ambiente seguro</div></section>
      <main className="login-main"><div className="login-card"><div className="login-card-header"><span className="section-kicker">BEM-VINDO DE VOLTA</span><h2>Acesse sua conta</h2><p>Informe suas credenciais para continuar.</p></div>
        {tokenDesafio ? <form onSubmit={(event) => void confirmarMfa(event)} className="space-y-6">
          <div><label htmlFor="codigo-mfa" className="login-label">Código do autenticador</label><input id="codigo-mfa" type="text" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" minLength={6} maxLength={6} autoFocus placeholder="000000" value={codigo} onChange={(event) => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6))} /></div>
          <button type="submit" disabled={loading || codigo.length !== 6} className="login-submit">{loading ? 'Validando...' : 'Confirmar código'} <span>→</span></button>
          <button type="button" className="login-secondary" onClick={() => { setTokenDesafio(''); setCodigo(''); }}>Voltar para o login</button>
        </form> : <form onSubmit={handleLogin} className="space-y-6">
          <div><label htmlFor="email" className="login-label">E-mail corporativo</label><input id="email" type="email" autoComplete="email" required placeholder="voce@instituicao.com.br" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div><label htmlFor="senha" className="login-label">Senha</label><input id="senha" type="password" autoComplete="current-password" required placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} /></div>
          <Link className="login-link" to="/esqueci-senha">Esqueci minha senha</Link>
          <button type="submit" disabled={loading} className="login-submit">{loading ? 'Autenticando...' : 'Entrar no painel'} <span>→</span></button>
          <div className="login-divider"><span>ou</span></div>
          <button type="button" disabled={loading} className="login-passkey" onClick={() => void entrarComPasskey()}>◉ Entrar com passkey</button>
        </form>}
        <p className="login-security">🔒 Sua sessão é protegida e monitorada.</p></div></main>
    </div>
  );
}
