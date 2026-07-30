import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const tokenValido = /^[a-fA-F0-9]{64}$/.test(token);

  const redefinirSenha = async (event: React.FormEvent) => {
    event.preventDefault();
    if (senha !== confirmacao) return toast.error('As senhas não coincidem.');
    setLoading(true);
    try {
      const { data } = await api.post<{ message?: string }>('/redefinir-senha', { token, senha });
      toast.success(data.message ?? 'Senha redefinida com sucesso.');
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      toast.error(mensagemErro(error, 'Não foi possível redefinir a senha. Solicite um novo link.'));
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-page"><section className="login-aside"><div className="login-brand"><span>E</span><strong>Escola</strong></div><div className="login-message"><span className="section-kicker">NOVA SENHA</span><h1>Escolha uma senha segura.</h1><p>Use pelo menos 8 caracteres e não reutilize senhas já utilizadas.</p></div><div className="login-footer">© {new Date().getFullYear()} Escola Gestão · Ambiente seguro</div></section><main className="login-main"><div className="login-card"><div className="login-card-header"><span className="section-kicker">REDEFINIR SENHA</span><h2>Defina uma nova senha</h2><p>{tokenValido ? 'Crie uma senha com pelo menos 8 caracteres.' : 'Este link é inválido ou está incompleto.'}</p></div>{tokenValido ? <form onSubmit={redefinirSenha}><div><label htmlFor="senha" className="login-label">Nova senha</label><input id="senha" type="password" autoComplete="new-password" minLength={8} required value={senha} onChange={(event) => setSenha(event.target.value)} /></div><div><label htmlFor="confirmacao" className="login-label">Confirme a nova senha</label><input id="confirmacao" type="password" autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} /></div><button type="submit" disabled={loading} className="login-submit">{loading ? 'Redefinindo...' : 'Redefinir senha'} <span>→</span></button></form> : null}<Link className="login-link login-link-centered" to="/esqueci-senha">Solicitar um novo link</Link></div></main></div>;
}
