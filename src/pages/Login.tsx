import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro, salvarSessao, type Usuario } from '../api';

interface LoginResponse {
  token?: string;
  accessToken?: string;
  usuario?: Usuario;
  message?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/login', { email, senha_hash: senha });
      const token = data.token ?? data.accessToken;
      if (!token) throw new Error('A API não retornou um token de acesso.');

      salvarSessao(token, data.usuario);
      toast.success(data.message ?? 'Login realizado com sucesso!');
      navigate('/', { replace: true });
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      toast.error(mensagemErro(error, 'Não foi possível realizar o login.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <div className="text-center mb-8"><h1 className="text-2xl font-bold text-gray-800">Acesso ao Sistema</h1><p className="text-gray-600 mt-2 text-sm">Insira suas credenciais para gerenciar a escola</p></div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label><input id="email" type="email" autoComplete="email" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="admin@escola.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <div><label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label><input id="senha" type="password" autoComplete="current-password" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={senha} onChange={(event) => setSenha(event.target.value)} /></div>
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors">{loading ? 'Autenticando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  );
}
