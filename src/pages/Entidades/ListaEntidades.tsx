import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Tipagem baseada no seu banco de dados
interface Entidade {
  id: number;
  nome: string;
}

export default function ListaEntidades() {
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Busca os dados da sua API assim que a tela abre
  useEffect(() => {
    const carregarEntidades = async () => {
      try {
        // Ajuste a URL se a sua API estiver em outro endereço
        const response = await fetch('http://localhost:3000/escolas');
        const data = await response.json();
        setEntidades(data);
      } catch (err) {
        console.error('Erro ao buscar entidades', err);
      } finally {
        setLoading(false);
      }
    };
    
    carregarEntidades();
  }, []);

  const handleExcluir = async (id: number) => {
    // Janela de confirmação nativa do navegador
    const confirmar = window.confirm('Tem certeza que deseja excluir esta entidade?');
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:3000/escolas/${id}`, {
        method: 'DELETE',
      });

   if (response.ok) {
        setEntidades(entidades.filter((entidade) => entidade.id !== id));
        toast.success('Entidade excluída!'); // <-- Pode adicionar um toast de sucesso aqui também!
      } else {
        toast.error('Erro ao excluir a entidade na API.');
      }
    } catch (erro) {
      console.error('Erro de conexão ao excluir:', erro);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* Cabeçalho e Botão de Novo */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consulta de Entidades</h1>
        <Link to="/entidades/novo">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors">
            + Nova Entidade
          </button>
        </Link>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nome da Entidade
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-5 py-5 text-center text-gray-500">
                  Carregando dados da API...
                </td>
              </tr>
            ) : (
              entidades.map((entidade) => (
                <tr key={entidade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 font-semibold">{entidade.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm">
                    <p className="text-gray-900">{entidade.nome}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-sm text-right">
                    {/* Botão de Editar virou um Link passando o ID na URL */}
                    <Link 
                      to={`/entidades/editar/${entidade.id}`} 
                      className="text-sm text-blue-600 hover:text-blue-900 font-semibold mr-4 inline-block"
                    >
                      Editar
                    </Link>
                    
                    {/* Botão de Excluir chama a função que acabamos de criar */}
                    <button 
                      onClick={() => handleExcluir(entidade.id)}
                      className="text-sm text-red-600 hover:text-red-900 font-semibold cursor-pointer"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
            
            {/* Se não houver dados, mostra essa mensagem */}
            {!loading && entidades.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-5 text-center text-gray-500">
                  Nenhuma entidade encontrada no banco de dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}