import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CadastroEntidade() {
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    
    try {
      const response = await fetch('https://api.codeapps.com.br/escolas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }), // Envia o nome digitado para a API
      });

   if (response.ok) {
        toast.success('Entidade cadastrada com sucesso!');
        navigate('/entidades');
      } else {
        toast.error('Erro ao cadastrar a entidade.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nova Entidade</h1>
        <button 
          onClick={() => navigate('/entidades')}
          className="text-gray-600 hover:text-gray-900 font-semibold"
        >
          Voltar para Lista
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-gray-200">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
            Nome da Entidade
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            id="nome"
            type="text"
            placeholder="Ex: Instituto de Tecnologia"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none shadow transition-colors"
            type="submit"
          >
            Salvar Entidade
          </button>
        </div>
      </form>
    </div>
  );
}