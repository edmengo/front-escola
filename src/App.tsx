import { BrowserRouter as Router, Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { limparSessao, obterUsuario, sessaoAtiva } from './api';
import Home from './pages/Home';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import ListaEntidades from './pages/Entidades/ListaEntidades';
import CadastroEntidade from './pages/Entidades/CadastroEntidade';
import EditarEntidade from './pages/Entidades/EditarEntidade';
import ListaCursos from './pages/Cursos/ListaCursos';
import CadastroCurso from './pages/Cursos/CadastroCurso';
import EditarCurso from './pages/Cursos/EditarCurso';
import ListaAlunos from './pages/Alunos/ListaAlunos';
import CadastroAluno from './pages/Alunos/CadastroAluno';
import EditarAluno from './pages/Alunos/EditarAluno';
import CadastroUsuario from './pages/Usuarios/CadastroUsuario';
import EditarUsuario from './pages/Usuarios/EditarUsuario';
import ListaUsuarios from './pages/Usuarios/ListaUsuarios';
import AlterarSenha from './pages/AlterarSenha';
import ConfigurarMfa from './pages/ConfigurarMfa';
import Passkeys from './components/Passkeys';

type Perfil = 'admin' | 'secretario' | 'professor';

const navegacao = [
  { to: '/', icon: '⌂', label: 'Visão geral', end: true },
  { to: '/entidades', icon: '◈', label: 'Entidades', perfis: ['admin', 'secretario'] as Perfil[] },
  { to: '/cursos', icon: '▤', label: 'Cursos' },
  { to: '/alunos', icon: '◉', label: 'Alunos' },
  { to: '/usuarios', icon: '◌', label: 'Usuários', perfis: ['admin'] as Perfil[] },
  { to: '/minha-conta/senha', icon: '◇', label: 'Alterar senha' },
  { to: '/minha-conta/seguranca', icon: '⌾', label: 'Segurança MFA' },
  { to: '/minha-conta/passkeys', icon: '◉', label: 'Passkeys FIDO2' },
];

function AdminLayout() {
  const navigate = useNavigate();
  if (!sessaoAtiva()) return <Navigate to="/login" replace />;
  const usuario = obterUsuario();
  const nomeUsuario = usuario?.nome ?? usuario?.email ?? 'Usuário';
  const iniciais = nomeUsuario.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
  const sair = () => { limparSessao(); navigate('/login'); };
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">E</span><div><strong>Escola</strong><small>GESTÃO EDUCACIONAL</small></div></div>
      <div className="workspace"><span className="workspace-dot" /> Ambiente administrativo</div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        <p>MENU PRINCIPAL</p>
        {navegacao.filter((item) => !item.perfis || (usuario?.perfil && item.perfis.includes(usuario.perfil))).map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><span className="nav-icon">{item.icon}</span>{item.label}</NavLink>)}
      </nav>
      <div className="sidebar-footer"><div className="support-card"><span>?</span><div><strong>Precisa de ajuda?</strong><small>Fale com o suporte</small></div></div><button className="logout-button" onClick={sair}><span>↗</span> Encerrar sessão</button></div>
    </aside>
    <section className="app-content"><header className="topbar"><div><span className="eyebrow">PAINEL ADMINISTRATIVO</span><p>Gestão integrada da sua instituição</p></div><div className="user-chip"><span className="avatar">{iniciais}</span><div><strong>{nomeUsuario}</strong><small>{usuario?.perfil ?? 'Sessão ativa'}</small></div></div></header><main className="page-content"><Outlet /></main></section>
  </div>;
}

function PerfilRoute({ perfis }: { perfis: Perfil[] }) {
  const perfil = obterUsuario()?.perfil;
  return perfil && perfis.includes(perfil) ? <Outlet /> : <Navigate to="/" replace />;
}

function PasskeysPage() {
  return <div className="security-page"><header><span className="section-kicker">MINHA CONTA</span><h1>Passkeys FIDO2</h1><p>Use biometria, PIN do dispositivo ou chave física para entrar.</p></header><Passkeys /></div>;
}

export default function App() {
  return <Router><Toaster position="top-right" toastOptions={{ duration: 4000 }} /><Routes><Route path="/login" element={<Login />} /><Route path="/esqueci-senha" element={<EsqueciSenha />} /><Route path="/redefinir-senha" element={<RedefinirSenha />} /><Route element={<AdminLayout />}><Route path="/" element={<Home />} /><Route path="/minha-conta/senha" element={<AlterarSenha />} /><Route path="/minha-conta/seguranca" element={<ConfigurarMfa />} /><Route path="/minha-conta/passkeys" element={<PasskeysPage />} /><Route path="/cursos" element={<ListaCursos />} /><Route path="/alunos" element={<ListaAlunos />} /><Route element={<PerfilRoute perfis={['admin', 'secretario']} />}><Route path="/entidades" element={<ListaEntidades />} /><Route path="/entidades/novo" element={<CadastroEntidade />} /><Route path="/entidades/editar/:id" element={<EditarEntidade />} /><Route path="/cursos/novo" element={<CadastroCurso />} /><Route path="/cursos/editar/:id" element={<EditarCurso />} /><Route path="/alunos/novo" element={<CadastroAluno />} /><Route path="/alunos/editar/:id" element={<EditarAluno />} /></Route><Route element={<PerfilRoute perfis={['admin']} />}><Route path="/usuarios" element={<ListaUsuarios />} /><Route path="/usuarios/novo" element={<CadastroUsuario />} /><Route path="/usuarios/editar/:id" element={<EditarUsuario />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></Router>;
}
