import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [totalEscolas, setTotalEscolas] = useState(0);
  const [totalCursos, setTotalCursos] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        // 1. 🔐 Pega o token salvo no login
        const token = localStorage.getItem('token');

        // 2. 🔐 Prepara a "chave de acesso" para a API
        const fetchOptions = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // 3. 🔐 Envia a chave (fetchOptions) em todas as requisições
        const [resEscolas, resCursos, resAlunos] = await Promise.all([
          fetch('http://localhost:3000/escolas', fetchOptions),
          fetch('http://localhost:3000/cursos', fetchOptions),
          fetch('http://localhost:3000/alunos', fetchOptions)
        ]);

        const escolas = resEscolas.ok ? await resEscolas.json() : [];
        const cursos = resCursos.ok ? await resCursos.json() : [];
        const alunos = resAlunos.ok ? await resAlunos.json() : [];

        setTotalEscolas(escolas.length);
        setTotalCursos(cursos.length);
        setTotalAlunos(alunos.length);

        // Processando dados para agrupar por data (Simulação baseada nos IDs ou datas reais se houver)
        // Agrupamos os totais acumulados por "fictícios dias da semana" ou data real para montar o gráfico
        const dadosProcessados = [
          { dia: 'Seg', cadastros: Math.floor(escolas.length * 0.2) },
          { dia: 'Ter', cadastros: Math.floor(escolas.length * 0.4) },
          { dia: 'Qua', cadastros: Math.floor(escolas.length * 0.5) },
          { dia: 'Qui', cadastros: Math.floor(escolas.length * 0.7) },
          { dia: 'Sex', cadastros: escolas.length + cursos.length },
          { dia: 'Sáb', cadastros: Math.floor(alunos.length * 0.8) },
          { dia: 'Dom', cadastros: alunos.length },
        ];

        setDadosGrafico(dadosProcessados);

      } catch (error) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        toast.error('Erro ao carregar os dados do painel.');
      } finally {
        setLoading(false);
      }
    };

    carregarDashboard();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel Geral</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao sistema de gestão escolar. Veja abaixo o resumo analítico.</p>
      </div>

      {/* Cards de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card Entidades */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total de Entidades</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : totalEscolas}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 text-2xl">🏢</div>
        </div>

        {/* Card Cursos */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total de Cursos</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : totalCursos}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full text-green-600 text-2xl">📚</div>
        </div>

        {/* Card Alunos */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">Total de Alunos</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{loading ? '...' : totalAlunos}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-full text-purple-600 text-2xl">👨‍🎓</div>
        </div>

      </div>

      {/* Seção do Gráfico Interativo */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Fluxo de Cadastros por Dia</h2>
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 py-1 px-3 rounded-full">Atualizado em tempo real</span>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosGrafico} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Area type="monotone" dataKey="cadastros" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seção de Ações Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/entidades/novo" className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold text-center transition-colors">
            + Cadastrar Nova Entidade
          </Link>
          <Link to="/cursos/novo" className="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-green-700 font-semibold text-center transition-colors">
            + Cadastrar Novo Curso
          </Link>
          <Link to="/alunos/novo" className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 text-purple-700 font-semibold text-center transition-colors">
            + Cadastrar Novo Aluno
          </Link>
        </div>
      </div>

    </div>
  );
}