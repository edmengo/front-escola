import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../../api';

type Perfil = 'admin' | 'secretario' | 'professor';

export default function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [perfil, setPerfil] = useState<Perfil>('professor');
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  const cadastrar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (senha !== confirmacaoSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setSalvando(true);
    try {
      await api.post('/usuarios', { nome: nome.trim(), email: email.trim(), senha, perfil });
      toast.success('Usuário cadastrado com sucesso!');
      navigate('/usuarios', { replace: true });
    } catch (error: unknown) {
      toast.error(mensagemErro(error, 'Não foi possível cadastrar o usuário.'));
    } finally {
      setSalvando(false);
    }
  };

  return <div className="p-6 max-w-2xl mx-auto"><div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold">Novo Usuário</h1><p className="text-sm text-gray-500 mt-1">Defina o acesso de um novo integrante do sistema.</p></div><button type="button" onClick={() => navigate('/usuarios')}>Voltar</button></div><form onSubmit={(event) => void cadastrar(event)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 border"><div className="grid gap-4"><div><label className="block font-bold mb-2" htmlFor="nome">Nome completo</label><input className="border rounded w-full py-2 px-3" id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required minLength={3} maxLength={150} autoComplete="name" /></div><div><label className="block font-bold mb-2" htmlFor="email">E-mail</label><input className="border rounded w-full py-2 px-3" id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} autoComplete="email" /></div><div><label className="block font-bold mb-2" htmlFor="perfil">Perfil de acesso</label><select className="border rounded w-full py-2 px-3" id="perfil" value={perfil} onChange={(event) => setPerfil(event.target.value as Perfil)}><option value="professor">Professor — consulta cursos e alunos</option><option value="secretario">Secretário — gerencia escolas, cursos e alunos</option><option value="admin">Administrador — acesso total</option></select></div><div><label className="block font-bold mb-2" htmlFor="senha">Senha inicial</label><input className="border rounded w-full py-2 px-3" id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required minLength={8} maxLength={128} autoComplete="new-password" /></div><div><label className="block font-bold mb-2" htmlFor="confirmacaoSenha">Confirme a senha</label><input className="border rounded w-full py-2 px-3" id="confirmacaoSenha" type="password" value={confirmacaoSenha} onChange={(event) => setConfirmacaoSenha(event.target.value)} required minLength={8} maxLength={128} autoComplete="new-password" /></div></div><div className="flex justify-end gap-4 mt-6"><button type="button" onClick={() => navigate('/usuarios')}>Cancelar</button><button disabled={salvando} className="bg-green-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50" type="submit">{salvando ? 'Cadastrando...' : 'Cadastrar usuário'}</button></div></form></div>;
}
