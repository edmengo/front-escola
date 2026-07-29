import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function EditarCurso() {
  const [escolaId, setEscolaId] = useState<number | ''>(''); 
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const carregarCurso = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cursos/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNome(data.nome);
          setEscolaId(data.escola_id);
        } else {
          toast.error('Curso não encontrado!');
          navigate('/cursos');
        }
      } catch (error) {
        console.error('Erro ao buscar o curso:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarCurso();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/cursos/${id}`, {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, escola_id: escolaId }),
      });

      if (response.ok) {
        toast.success('Curso atualizado com sucesso!');
        navigate('/cursos');
      } else {
        toast.error('Erro ao atualizar o curso.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      toast.error('Erro de conexão com o servidor.');
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Carregando dados...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Editar Curso</h1>
        <button onClick={() => navigate('/cursos')} className="text-gray-600 hover:text-gray-900 font-semibold">Voltar para Lista</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome do Curso</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required
          />
        </div>
        <div className="flex items-center justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none shadow transition-colors" type="submit">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}