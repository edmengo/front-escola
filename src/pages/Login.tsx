import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro, salvarSessao, type Usuario } from '../api';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  usuario?: Usuario;
  message?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/login', { email, senha_hash: senha });
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

  return (
    <div className="login-page">
      <section className="login-aside"><div className="login-brand"><span>E</span><strong>Escola</strong></div><div className="login-message"><span className="section-kicker">GESTÃO EDUCACIONAL</span><h1>Uma gestão mais simples, decisões mais seguras.</h1><p>Centralize entidades, cursos e alunos em uma única plataforma de administração.</p></div><div className="login-footer">© {new Date().getFullYear()} Escola Gestão · Ambiente seguro</div></section>
      <main className="login-main"><div className="login-card"><div className="login-card-header"><span className="section-kicker">BEM-VINDO DE VOLTA</span><h2>Acesse sua conta</h2><p>Informe suas credenciais para continuar.</p></div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div><label htmlFor="email" className="login-label">E-mail corporativo</label><input id="email" type="email" autoComplete="email" required placeholder="voce@instituicao.com.br" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div><label htmlFor="senha" className="login-label">Senha</label><input id="senha" type="password" autoComplete="current-password" required placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} /></div>
          <button type="submit" disabled={loading} className="login-submit">{loading ? 'Autenticando...' : 'Entrar no painel'} <span>→</span></button>
        </form>
        <p className="login-security">🔒 Sua sessão é protegida e monitorada.</p></div></main>
    </div>
  );
}
