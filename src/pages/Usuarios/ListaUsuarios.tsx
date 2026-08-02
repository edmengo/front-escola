import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro, obterUsuario, type Usuario } from '../../api';

interface UsuarioAdministrado extends Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'admin' | 'secretario' | 'professor';
  ativo: boolean;
  created_at: string;
}

const perfilLabel = { admin: 'Administrador', secretario: 'Secretário', professor: 'Professor' };

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdministrado[]>([]);
  const [loading, setLoading] = useState(true);
  const usuarioAtual = obterUsuario();

  useEffect(() => {
    let ativo = true;
    api.get<UsuarioAdministrado[]>('/usuarios', { params: { limit: 100 } })
      .then(({ data }) => { if (ativo) setUsuarios(data); })
      .catch((error: unknown) => { if (ativo) toast.error(mensagemErro(error, 'Não foi possível carregar os usuários.')); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  const alternarStatus = async (usuario: UsuarioAdministrado) => {
    if (usuario.id === usuarioAtual?.id) return toast.error('Você não pode bloquear o próprio usuário.');
    const acao = usuario.ativo ? 'bloquear' : 'ativar';
    if (!window.confirm(`Deseja ${acao} ${usuario.nome}?`)) return;
    try {
      const { data } = await api.put<UsuarioAdministrado>(`/usuarios/${usuario.id}`, { ...usuario, ativo: !usuario.ativo });
      setUsuarios((atuais) => atuais.map((item) => item.id === data.id ? data : item));
      toast.success(`Usuário ${data.ativo ? 'ativado' : 'bloqueado'} com sucesso.`);
    } catch (error) {
      toast.error(mensagemErro(error, `Não foi possível ${acao} o usuário.`));
    }
  };

  return <div className="p-6 max-w-6xl mx-auto"><div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold">Usuários e acessos</h1><p className="text-sm text-gray-500 mt-1">Gerencie contas, perfis e bloqueios de acesso.</p></div><Link to="/usuarios/novo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">+ Novo usuário</Link></div><div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200"><table className="min-w-full leading-normal"><thead><tr><th className="px-5 py-3 text-left">Usuário</th><th className="px-5 py-3 text-left">Perfil</th><th className="px-5 py-3 text-left">Status</th><th className="px-5 py-3 text-right">Ações</th></tr></thead><tbody>{loading ? <tr><td colSpan={4} className="px-5 py-5 text-center">Carregando...</td></tr> : usuarios.map((usuario) => <tr key={usuario.id} className="border-t"><td className="px-5 py-5"><strong>{usuario.nome}</strong><div className="text-sm text-gray-500">{usuario.email}</div></td><td className="px-5 py-5">{perfilLabel[usuario.perfil]}</td><td className="px-5 py-5"><span className={usuario.ativo ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>{usuario.ativo ? 'Ativo' : 'Bloqueado'}</span></td><td className="px-5 py-5 text-right"><Link to={`/usuarios/editar/${usuario.id}`} className="text-blue-600 font-semibold mr-4">Editar</Link><button type="button" disabled={usuario.id === usuarioAtual?.id} onClick={() => void alternarStatus(usuario)} className="text-red-600 font-semibold disabled:opacity-40">{usuario.ativo ? 'Bloquear' : 'Ativar'}</button></td></tr>)}{!loading && !usuarios.length && <tr><td colSpan={4} className="px-5 py-5 text-center text-gray-500">Nenhum usuário cadastrado.</td></tr>}</tbody></table></div><section className="bg-white border rounded-lg p-5 mt-6"><h2 className="font-bold mb-3">Permissões por perfil</h2><div className="grid gap-2 text-sm"><p><strong>Administrador:</strong> acesso completo e gestão de usuários.</p><p><strong>Secretário:</strong> cadastra e edita entidades, cursos e alunos; não exclui registros.</p><p><strong>Professor:</strong> consulta cursos e alunos; não altera registros.</p></div></section></div>;
}
