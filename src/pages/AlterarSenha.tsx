import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const alterar = async (event: React.FormEvent) => {
    event.preventDefault();
    if (novaSenha !== confirmacao) return toast.error('As novas senhas não coincidem.');
    if (senhaAtual === novaSenha) return toast.error('A nova senha deve ser diferente da atual.');

    setSalvando(true);
    try {
      await api.patch('/minha-conta/senha', { senhaAtual, novaSenha });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmacao('');
      toast.success('Senha alterada com sucesso.');
    } catch (error) {
      toast.error(mensagemErro(error, 'Não foi possível alterar a senha.'));
    } finally {
      setSalvando(false);
    }
  };

  return <div className="p-6 max-w-2xl mx-auto"><div className="mb-6"><h1 className="text-2xl font-bold">Alterar minha senha</h1><p className="text-sm text-gray-500 mt-1">Confirme sua senha atual e escolha uma nova senha segura.</p></div><form onSubmit={(event) => void alterar(event)} className="bg-white px-8 pt-6 pb-8 border"><div className="grid gap-4"><div><label className="block font-bold mb-2" htmlFor="senha-atual">Senha atual</label><input className="border w-full py-2 px-3" id="senha-atual" type="password" autoComplete="current-password" required maxLength={128} value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} /></div><div><label className="block font-bold mb-2" htmlFor="nova-senha">Nova senha</label><input className="border w-full py-2 px-3" id="nova-senha" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} /></div><div><label className="block font-bold mb-2" htmlFor="confirmacao-senha">Confirme a nova senha</label><input className="border w-full py-2 px-3" id="confirmacao-senha" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} /></div></div><div className="flex justify-end mt-6"><button disabled={salvando} className="bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50" type="submit">{salvando ? 'Alterando...' : 'Alterar senha'}</button></div></form></div>;
}
