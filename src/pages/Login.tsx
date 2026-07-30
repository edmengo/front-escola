import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Hook do react-router-dom para redirecionar de tela
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setLoading(true);

    try {
      // Faz a requisição para a rota que acabamos de criar na api-escola
      const response = await fetch('https://api.codeapps.com.br/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos o email e a senha digitados (com o nome que a API espera: senha_hash)
        body: JSON.stringify({ email, senha_hash: senha }),
      });

      const data = await response.json();

      // Se o status da resposta não for ok (ex: 401 ou 500)
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }

      // Se deu tudo certo!
      toast.success(data.message || 'Login realizado com sucesso!');
      
      // Salva os dados do usuário no navegador (localStorage) para usarmos depois
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redireciona o usuário para o seu painel (Home)
      navigate('/'); 

    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Acesso ao Sistema</h2>
          <p className="text-gray-600 mt-2 text-sm">Insira suas credenciais para gerenciar a escola</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@escola.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}