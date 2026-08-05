import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

interface EstadoMfa { ativo: boolean; confirmadoEm: string | null }
interface ConfiguracaoMfa { secret: string; otpauthUri: string }

export default function ConfigurarMfa() {
  const [estado, setEstado] = useState<EstadoMfa | null>(null);
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [configuracao, setConfiguracao] = useState<ConfiguracaoMfa | null>(null);
  const [qrCode, setQrCode] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    api.get<EstadoMfa>('/minha-conta/mfa')
      .then(({ data }) => { if (ativo) setEstado(data); })
      .catch((error) => { if (ativo) toast.error(mensagemErro(error, 'Não foi possível consultar o MFA.')); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const iniciar = async (event: React.FormEvent) => {
    event.preventDefault(); setSalvando(true);
    try {
      const { data } = await api.post<ConfiguracaoMfa>('/minha-conta/mfa/configurar', { senha });
      setConfiguracao(data);
      setQrCode(await QRCode.toDataURL(data.otpauthUri, { width: 220, margin: 1, errorCorrectionLevel: 'M' }));
      setSenha(''); toast.success('Escaneie o QR Code e confirme o primeiro código.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível iniciar a configuração.')); }
    finally { setSalvando(false); }
  };

  const confirmar = async (event: React.FormEvent) => {
    event.preventDefault(); setSalvando(true);
    try {
      await api.post('/minha-conta/mfa/confirmar', { codigo });
      setEstado({ ativo: true, confirmadoEm: new Date().toISOString() });
      setConfiguracao(null); setQrCode(''); setCodigo('');
      toast.success('Autenticação em duas etapas ativada.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível confirmar o código.')); }
    finally { setSalvando(false); }
  };

  const desativar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!window.confirm('Deseja realmente desativar a autenticação em duas etapas?')) return;
    setSalvando(true);
    try {
      await api.delete('/minha-conta/mfa', { data: { senha, codigo } });
      setEstado({ ativo: false, confirmadoEm: null }); setSenha(''); setCodigo('');
      toast.success('Autenticação em duas etapas desativada.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível desativar o MFA.')); }
    finally { setSalvando(false); }
  };

  if (carregando) return <div className="security-page"><p>Carregando configurações de segurança...</p></div>;

  return <div className="security-page"><header><span className="section-kicker">MINHA CONTA</span><h1>Segurança e autenticação</h1><p>Proteja sua conta com códigos temporários gerados no seu celular.</p></header><section className="security-card"><div className="security-status"><span className={estado?.ativo ? 'status-on' : 'status-off'}>{estado?.ativo ? 'MFA ativo' : 'MFA desativado'}</span>{estado?.confirmadoEm && <small>Ativado em {new Date(estado.confirmadoEm).toLocaleString('pt-BR')}</small>}</div>{estado?.ativo ? <form onSubmit={(event) => void desativar(event)}><h2>Desativar MFA</h2><p>Confirme sua senha e o código atual do autenticador.</p><label htmlFor="senha-desativar">Senha atual</label><input id="senha-desativar" type="password" autoComplete="current-password" required value={senha} onChange={(event) => setSenha(event.target.value)} /><label htmlFor="codigo-desativar">Código de seis dígitos</label><input id="codigo-desativar" className="otp-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={codigo} onChange={(event) => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6))} /><button className="danger-button" disabled={salvando || codigo.length !== 6}>{salvando ? 'Desativando...' : 'Desativar MFA'}</button></form> : configuracao ? <form onSubmit={(event) => void confirmar(event)}><h2>Conectar aplicativo autenticador</h2><ol><li>Abra o Google Authenticator, Microsoft Authenticator ou aplicativo compatível.</li><li>Escaneie o QR Code.</li><li>Informe abaixo o código exibido.</li></ol>{qrCode && <img className="mfa-qr" src={qrCode} alt="QR Code para configurar autenticação em duas etapas" />}<details><summary>Não consegue escanear?</summary><code className="mfa-secret">{configuracao.secret}</code></details><label htmlFor="codigo-confirmar">Código de confirmação</label><input id="codigo-confirmar" className="otp-input" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required autoFocus value={codigo} onChange={(event) => setCodigo(event.target.value.replace(/\D/g, '').slice(0, 6))} /><button className="primary-button" disabled={salvando || codigo.length !== 6}>{salvando ? 'Confirmando...' : 'Confirmar e ativar'}</button></form> : <form onSubmit={(event) => void iniciar(event)}><h2>Ativar MFA</h2><p>Por segurança, confirme sua senha atual para gerar o QR Code.</p><label htmlFor="senha-configurar">Senha atual</label><input id="senha-configurar" type="password" autoComplete="current-password" required value={senha} onChange={(event) => setSenha(event.target.value)} /><button className="primary-button" disabled={salvando}>{salvando ? 'Preparando...' : 'Configurar autenticador'}</button></form>}</section><aside className="security-note"><strong>Importante</strong><p>Não compartilhe o QR Code nem a chave manual. Se perder o autenticador, solicite a redefinição a outro administrador.</p></aside></div>;
}
