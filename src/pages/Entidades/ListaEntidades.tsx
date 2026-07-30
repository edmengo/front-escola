import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../../api';

interface Entidade { id: number; nome: string }

export default function ListaEntidades() {
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  useEffect(() => { const carregar = async () => { try { const { data } = await api.get<Entidade[]>('/escolas'); setEntidades(data); } catch (error: unknown) { toast.error(mensagemErro(error, 'Erro ao carregar entidades.')); } finally { setLoading(false); } }; void carregar(); }, []);
  const excluir = async (id: number) => { if (!window.confirm('Tem certeza que deseja excluir esta entidade?')) return; setExcluindoId(id); try { await api.delete(`/escolas/${id}`); setEntidades((atuais) => atuais.filter((entidade) => entidade.id !== id)); toast.success('Entidade excluída!'); } catch (error: unknown) { toast.error(mensagemErro(error, 'Erro ao excluir a entidade.')); } finally { setExcluindoId(null); } };
  return <div className="p-6 max-w-6xl mx-auto"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-gray-800">Consulta de Entidades</h1><Link to="/entidades/novo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">+ Nova Entidade</Link></div><div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200"><table className="min-w-full leading-normal"><thead><tr><th className="px-5 py-3 text-left">ID</th><th className="px-5 py-3 text-left">Nome da Entidade</th><th className="px-5 py-3 text-right">Ações</th></tr></thead><tbody>{loading ? <tr><td colSpan={3} className="px-5 py-5 text-center">Carregando...</td></tr> : entidades.map((entidade) => <tr key={entidade.id} className="border-t"><td className="px-5 py-5">{entidade.id}</td><td className="px-5 py-5">{entidade.nome}</td><td className="px-5 py-5 text-right"><Link to={`/entidades/editar/${entidade.id}`} className="text-blue-600 font-semibold mr-4">Editar</Link><button onClick={() => void excluir(entidade.id)} disabled={excluindoId === entidade.id} className="text-red-600 font-semibold disabled:opacity-50">{excluindoId === entidade.id ? 'Excluindo...' : 'Excluir'}</button></td></tr>)}{!loading && !entidades.length && <tr><td colSpan={3} className="px-5 py-5 text-center text-gray-500">Nenhuma entidade encontrada.</td></tr>}</tbody></table></div></div>;
}
