import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Curso {
  id: number;
  nome: string;
}

export default function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cursoId, setCursoId] = useState<number | ''>('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarCursos = async () => {
      try {
        const response = await fetch('http://localhost:3000/cursos');
        if (response.ok) {
          const data = await response.json();
          setCursos(data);
        } else {
          toast.error('Erro ao carregar a lista de cursos.');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    };
    carregarCursos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cursoId) {
      toast.error('Por favor, selecione um curso.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, matricula, curso_id: Number(cursoId) }),
      });

      if (response.ok) {
        toast.success('Aluno cadastrado com sucesso!');
        navigate('/alunos');
      } else {
        toast.error('Erro ao cadastrar o aluno.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      toast.error('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Novo Aluno</h1>
        <button onClick={() => navigate('/alunos')} className="text-gray-600 hover:text-gray-900 font-semibold">Voltar para Lista</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="curso">Curso</label>
          <select
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="curso"
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value ? Number(e.target.value) : '')}
            required
          >
            <option value="">Selecione um curso...</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="matricula">Matrícula</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="matricula" type="text" placeholder="Ex: 2026001" value={matricula} onChange={(e) => setMatricula(e.target.value)} required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">Nome do Aluno</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="nome" type="text" placeholder="Ex: João da Silva" value={nome} onChange={(e) => setNome(e.target.value)} required
          />
        </div>

        <div className="flex items-center justify-end">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none shadow transition-colors" type="submit">
            Salvar Aluno
          </button>
        </div>
      </form>
    </div>
  );
}