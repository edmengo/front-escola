import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const solicitarRedefinicao = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<{ message?: string }>('/esqueci-senha', { email });
      setEnviado(true);
      toast.success(data.message ?? 'Confira seu e-mail para continuar.');
    } catch (error: unknown) {
      toast.error(mensagemErro(error, 'Não foi possível solicitar a redefinição de senha.'));
    } finally {
      setLoading(false);
    }
  };

  return <div className="login-page"><section className="login-aside"><div className="login-brand"><span>E</span><strong>Escola</strong></div><div className="login-message"><span className="section-kicker">ACESSO SEGURO</span><h1>Recupere o acesso à sua conta.</h1><p>Enviaremos instruções seguras para você definir uma nova senha.</p></div><div className="login-footer">© {new Date().getFullYear()} Escola Gestão · Ambiente seguro</div></section><main className="login-main"><div className="login-card"><div className="login-card-header"><span className="section-kicker">RECUPERAR SENHA</span><h2>Esqueceu sua senha?</h2><p>{enviado ? 'Caso o e-mail esteja cadastrado, você receberá as instruções em instantes.' : 'Informe seu e-mail para receber um link de redefinição.'}</p></div>{!enviado && <form onSubmit={solicitarRedefinicao}><div><label htmlFor="email" className="login-label">E-mail corporativo</label><input id="email" type="email" autoComplete="email" required placeholder="voce@instituicao.com.br" value={email} onChange={(event) => setEmail(event.target.value)} /></div><button type="submit" disabled={loading} className="login-submit">{loading ? 'Enviando...' : 'Enviar instruções'} <span>→</span></button></form>}<Link className="login-link login-link-centered" to="/login">Voltar para o login</Link></div></main></div>;
}
