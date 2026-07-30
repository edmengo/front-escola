import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

const GraficoCadastros = lazy(() => import('../components/GraficoCadastros'));
interface Item { id: number }
interface DadoGrafico { dia: string; cadastros: number }

export default function Home() {
  const [totais, setTotais] = useState({ escolas: 0, cursos: 0, alunos: 0 });
  const [dadosGrafico, setDadosGrafico] = useState<DadoGrafico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const [escolas, cursos, alunos] = await Promise.all([
          api.get<Item[]>('/escolas'), api.get<Item[]>('/cursos'), api.get<Item[]>('/alunos'),
        ]);
        setTotais({ escolas: escolas.data.length, cursos: cursos.data.length, alunos: alunos.data.length });
        setDadosGrafico([]);
      } catch (error: unknown) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        toast.error(mensagemErro(error, 'Erro ao carregar os dados do painel.'));
      } finally { setLoading(false); }
    };
    void carregarDashboard();
  }, []);

  const indicadores = [
    ['Total de Entidades', totais.escolas, '🏢', 'bg-blue-100 text-blue-600'], ['Total de Cursos', totais.cursos, '📚', 'bg-green-100 text-green-600'], ['Total de Alunos', totais.alunos, '👨‍🎓', 'bg-purple-100 text-purple-600'],
  ] as const;
  return <div className="p-6 max-w-7xl mx-auto">
    <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Painel Geral</h1><p className="text-gray-600 mt-1">Resumo da gestão escolar.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{indicadores.map(([titulo, total, icone, classe]) => <div key={titulo} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between"><div><p className="text-sm font-medium text-gray-500 uppercase">{titulo}</p><p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : total}</p></div><div className={`${classe} p-4 rounded-full text-2xl`}>{icone}</div></div>)}</div>
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8"><h2 className="text-xl font-bold text-gray-800 mb-6">Cadastros por dia</h2><Suspense fallback={<p className="h-72 flex items-center justify-center text-gray-500">Carregando gráfico...</p>}><GraficoCadastros dados={dadosGrafico} /></Suspense></div>
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200"><h2 className="text-xl font-bold text-gray-800 mb-4">Ações rápidas</h2><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Link to="/entidades/novo" className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold text-center">+ Cadastrar Nova Entidade</Link><Link to="/cursos/novo" className="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-green-700 font-semibold text-center">+ Cadastrar Novo Curso</Link><Link to="/alunos/novo" className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 text-purple-700 font-semibold text-center">+ Cadastrar Novo Aluno</Link></div></div>
  </div>;
}
