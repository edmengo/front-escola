import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Escola {
  id: number;
  nome: string;
}

export default function CadastroCurso() {
  const [nome, setNome] = useState('');
  const [escolaId, setEscolaId] = useState<number | ''>('');
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const navigate = useNavigate();

  // Carrega a lista de escolas para o usuário poder escolher no select
  useEffect(() => {
    const carregarEscolas = async () => {
      try {
        const response = await fetch('http://localhost:3000/escolas');
        if (response.ok) {
          const data = await response.json();
          setEscolas(data);
        } else {
          toast.error('Erro ao carregar a lista de escolas.');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    };
    carregarEscolas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!escolaId) {
      toast.error('Por favor, selecione uma escola.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, escola_id: Number(escolaId) }), // <-- Enviando o escola_id exigido pela API
      });

      if (response.ok) {
        toast.success('Curso cadastrado com sucesso!');
        navigate('/cursos');
      } else {
        toast.error('Erro ao cadastrar o curso.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      toast.error('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Novo Curso</h1>
        <button onClick={() => navigate('/cursos')} className="text-gray-600 hover:text-gray-900 font-semibold">Voltar para Lista</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        
        {/* Campo de Seleção de Escola */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="escola">Escola / Entidade</label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="escola"
            value={escolaId}
            onChange={(e) => setEscolaId(e.target.value ? Number(e.target.value) : '')}
            required
          >
            <option value="">Selecione uma escola...</option>
            {escolas.map((escola) => (
              <option key={escola.id} value={escola.id}>
                {escola.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Nome do Curso */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome do Curso</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="nome" type="text" placeholder="Ex: Informática Básica" value={nome} onChange={(e) => setNome(e.target.value)} required
          />
        </div>

        <div className="flex items-center justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none shadow transition-colors" type="submit">
            Salvar Curso
          </button>
        </div>
      </form>
    </div>
  );
}
