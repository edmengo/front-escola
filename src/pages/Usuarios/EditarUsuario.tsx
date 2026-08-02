import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro, obterUsuario, type Usuario } from '../../api';

type Perfil = 'admin' | 'secretario' | 'professor';
interface UsuarioAdministrado extends Usuario { id: number; nome: string; email: string; perfil: Perfil; ativo: boolean }

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioAtual = obterUsuario();
  const [usuario, setUsuario] = useState<UsuarioAdministrado | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) {
      void navigate('/usuarios');
      return;
    }
    api.get<UsuarioAdministrado>(`/usuarios/${id}`).then(({ data }) => setUsuario(data)).catch((error) => {
      toast.error(mensagemErro(error, 'Usuário não encontrado.'));
      navigate('/usuarios');
    });
  }, [id, navigate]);

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!usuario) return;
    if (usuario.id === usuarioAtual?.id && (usuario.perfil !== 'admin' || !usuario.ativo)) return toast.error('Você não pode remover o próprio acesso administrativo.');
    setSalvando(true);
    try {
      await api.put(`/usuarios/${usuario.id}`, { nome: usuario.nome.trim(), email: usuario.email.trim(), perfil: usuario.perfil, ativo: usuario.ativo });
      toast.success('Usuário atualizado com sucesso.');
      navigate('/usuarios');
    } catch (error) {
      toast.error(mensagemErro(error, 'Não foi possível atualizar o usuário.'));
    } finally { setSalvando(false); }
  };

  const redefinirSenha = async () => {
    if (!usuario || senha !== confirmacao) return toast.error('As senhas não coincidem.');
    if (senha.length < 8) return toast.error('A senha deve ter pelo menos 8 caracteres.');
    try {
      await api.patch(`/usuarios/${usuario.id}/senha`, { senha });
      setSenha(''); setConfirmacao('');
      toast.success('Senha atualizada com sucesso.');
    } catch (error) { toast.error(mensagemErro(error, 'Não foi possível atualizar a senha.')); }
  };

  if (!usuario) return <p className="p-6 text-center">Carregando...</p>;
  const proprioUsuario = usuario.id === usuarioAtual?.id;
  return <div className="p-6 max-w-2xl mx-auto"><div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold">Editar usuário</h1><p className="text-sm text-gray-500 mt-1">Atualize dados, perfil e situação da conta.</p></div><button onClick={() => navigate('/usuarios')}>Voltar</button></div><form onSubmit={(event) => void salvar(event)} className="bg-white px-8 pt-6 pb-8 border"><div className="grid gap-4"><div><label className="block font-bold mb-2" htmlFor="nome">Nome</label><input className="border w-full py-2 px-3" id="nome" value={usuario.nome} onChange={(event) => setUsuario({ ...usuario, nome: event.target.value })} required minLength={3} maxLength={150} /></div><div><label className="block font-bold mb-2" htmlFor="email">E-mail</label><input className="border w-full py-2 px-3" id="email" type="email" value={usuario.email} onChange={(event) => setUsuario({ ...usuario, email: event.target.value })} required maxLength={254} /></div><div><label className="block font-bold mb-2" htmlFor="perfil">Perfil</label><select className="border w-full py-2 px-3" id="perfil" disabled={proprioUsuario} value={usuario.perfil} onChange={(event) => setUsuario({ ...usuario, perfil: event.target.value as Perfil })}><option value="admin">Administrador</option><option value="secretario">Secretário</option><option value="professor">Professor</option></select></div><label className="flex items-center gap-2"><input type="checkbox" disabled={proprioUsuario} checked={usuario.ativo} onChange={(event) => setUsuario({ ...usuario, ativo: event.target.checked })} /> Usuário ativo</label></div><div className="flex justify-end gap-4 mt-6"><button type="button" onClick={() => navigate('/usuarios')}>Cancelar</button><button disabled={salvando} className="bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50" type="submit">{salvando ? 'Salvando...' : 'Salvar'}</button></div></form><section className="bg-white border rounded-lg px-8 py-6 mt-6"><h2 className="font-bold mb-1">Redefinir senha</h2><p className="text-sm text-gray-500 mb-4">Defina uma senha temporária e envie-a ao usuário por um canal seguro.</p><div className="grid gap-4"><input type="password" placeholder="Nova senha" minLength={8} maxLength={128} value={senha} onChange={(event) => setSenha(event.target.value)} autoComplete="new-password" /><input type="password" placeholder="Confirmar nova senha" minLength={8} maxLength={128} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} autoComplete="new-password" /><button type="button" className="bg-slate-700 text-white font-bold py-2 px-4 rounded" onClick={() => void redefinirSenha()}>Atualizar senha</button></div></section></div>;
}
