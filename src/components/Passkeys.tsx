import { useEffect, useState } from 'react';
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

interface Passkey { id: number; nome: string; possuiBackup: boolean; criadoEm: string; ultimoUsoEm: string | null }

export default function Passkeys() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('Meu dispositivo');
  const [ocupado, setOcupado] = useState(false);
  const suportado = browserSupportsWebAuthn();

  useEffect(() => {
    api.get<Passkey[]>('/minha-conta/passkeys').then(({ data }) => setPasskeys(data))
      .catch((error) => toast.error(mensagemErro(error, 'Não foi possível carregar as passkeys.')));
  }, []);

  const adicionar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!suportado) return toast.error('Este navegador não suporta passkeys.');
    setOcupado(true);
    try {
      const { data } = await api.post('/minha-conta/passkeys/opcoes-registro', { senha });
      const response = await startRegistration({ optionsJSON: data.options });
      await api.post('/minha-conta/passkeys/confirmar', { challengeId: data.challengeId, nome, response });
      setPasskeys((await api.get<Passkey[]>('/minha-conta/passkeys')).data); setSenha('');
      toast.success('Passkey adicionada com sucesso.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível adicionar a passkey.')); }
    finally { setOcupado(false); }
  };

  const remover = async (passkey: Passkey) => {
    const senhaAtual = window.prompt(`Informe sua senha para remover “${passkey.nome}”:`);
    if (!senhaAtual) return;
    setOcupado(true);
    try {
      await api.delete(`/minha-conta/passkeys/${passkey.id}`, { data: { senha: senhaAtual } });
      setPasskeys((atuais) => atuais.filter((item) => item.id !== passkey.id));
      toast.success('Passkey removida.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível remover a passkey.')); }
    finally { setOcupado(false); }
  };

  return <section className="security-card passkey-card"><div className="passkey-heading"><div><h2>Passkeys e chaves FIDO2</h2><p>Entre com biometria, PIN do dispositivo ou chave de segurança.</p></div><span className={suportado ? 'status-on' : 'status-off'}>{suportado ? 'Compatível' : 'Não compatível'}</span></div>{passkeys.length > 0 && <div className="passkey-list">{passkeys.map((item) => <article key={item.id}><span className="passkey-icon">◉</span><div><strong>{item.nome}</strong><small>{item.possuiBackup ? 'Passkey sincronizada' : 'Dispositivo único'} · criada em {new Date(item.criadoEm).toLocaleDateString('pt-BR')}{item.ultimoUsoEm ? ` · último uso ${new Date(item.ultimoUsoEm).toLocaleDateString('pt-BR')}` : ''}</small></div><button disabled={ocupado} onClick={() => void remover(item)}>Remover</button></article>)}</div>}<form onSubmit={(event) => void adicionar(event)}><label htmlFor="nome-passkey">Nome desta passkey</label><input id="nome-passkey" required maxLength={80} value={nome} onChange={(event) => setNome(event.target.value)} /><label htmlFor="senha-passkey">Confirme sua senha atual</label><input id="senha-passkey" type="password" autoComplete="current-password" required value={senha} onChange={(event) => setSenha(event.target.value)} /><button className="primary-button" disabled={ocupado || !suportado}>{ocupado ? 'Aguardando dispositivo...' : 'Adicionar passkey'}</button></form></section>;
}
