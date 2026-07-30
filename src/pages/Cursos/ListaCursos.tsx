import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Curso {
  id: number;
  nome: string;
}

export default function ListaCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const carregarCursos = async () => {
      try {
        const response = await fetch('https://api.codeapps.com.br/cursos');
        const data = await response.json();
        setCursos(data);
      } catch (err) {
        console.error('Erro ao buscar cursos', err);
        toast.error('Erro ao carregar a lista de cursos.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarCursos();
  }, []);

  const handleExcluir = async (id: number) => {
    const confirmar = window.confirm('Tem certeza que deseja excluir este curso?');
    if (!confirmar) return;

    try {
      const response = await fetch(`https://api.codeapps.com.br/cursos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCursos(cursos.filter((curso) => curso.id !== id));
        toast.success('Curso excluído com sucesso!');
      } else {
        toast.error('Erro ao excluir o curso na API.');
      }
    } catch (erro) {
      console.error('Erro de conexão ao excluir:', erro);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consulta de Cursos</h1>
        <Link to="/cursos/novo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors inline-block">
          + Novo Curso
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome do Curso</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-5 py-5 text-center text-gray-500">Carregando dados da API...</td></tr>
            ) : (
              cursos.map((curso) => (
                <tr key={curso.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900 font-semibold">{curso.id}</p></td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900">{curso.nome}</p></td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                    <Link to={`/cursos/editar/${curso.id}`} className="text-sm text-blue-600 hover:text-blue-900 font-semibold mr-4 inline-block">Editar</Link>
                    <button onClick={() => handleExcluir(curso.id)} className="text-sm text-red-600 hover:text-red-900 font-semibold cursor-pointer">Excluir</button>
                  </td>
                </tr>
              ))
            )}
            {!loading && cursos.length === 0 && (
              <tr><td colSpan={3} className="px-5 py-5 text-center text-gray-500">Nenhum curso encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}