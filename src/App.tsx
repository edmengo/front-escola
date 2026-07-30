import { BrowserRouter as Router, Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { limparSessao, sessaoAtiva } from './api';
import Home from './pages/Home';
import Login from './pages/Login';
import ListaEntidades from './pages/Entidades/ListaEntidades';
import CadastroEntidade from './pages/Entidades/CadastroEntidade';
import EditarEntidade from './pages/Entidades/EditarEntidade';
import ListaCursos from './pages/Cursos/ListaCursos';
import CadastroCurso from './pages/Cursos/CadastroCurso';
import EditarCurso from './pages/Cursos/EditarCurso';
import ListaAlunos from './pages/Alunos/ListaAlunos';
import CadastroAluno from './pages/Alunos/CadastroAluno';
import EditarAluno from './pages/Alunos/EditarAluno';

const navegacao = [
  { to: '/', icon: '⌂', label: 'Visão geral', end: true },
  { to: '/entidades', icon: '◈', label: 'Entidades' },
  { to: '/cursos', icon: '▤', label: 'Cursos' },
  { to: '/alunos', icon: '◉', label: 'Alunos' },
];

function AdminLayout() {
  const navigate = useNavigate();
  if (!sessaoAtiva()) return <Navigate to="/login" replace />;
  const sair = () => { limparSessao(); navigate('/login'); };
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">E</span><div><strong>Escola</strong><small>GESTÃO EDUCACIONAL</small></div></div>
      <div className="workspace"><span className="workspace-dot" /> Ambiente administrativo</div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        <p>MENU PRINCIPAL</p>
        {navegacao.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><span className="nav-icon">{item.icon}</span>{item.label}</NavLink>)}
      </nav>
      <div className="sidebar-footer"><div className="support-card"><span>?</span><div><strong>Precisa de ajuda?</strong><small>Fale com o suporte</small></div></div><button className="logout-button" onClick={sair}><span>↗</span> Encerrar sessão</button></div>
    </aside>
    <section className="app-content"><header className="topbar"><div><span className="eyebrow">PAINEL ADMINISTRATIVO</span><p>Gestão integrada da sua instituição</p></div><div className="user-chip"><span className="avatar">AD</span><div><strong>Administrador</strong><small>Sessão ativa</small></div></div></header><main className="page-content"><Outlet /></main></section>
  </div>;
}

export default function App() {
  return <Router><Toaster position="top-right" toastOptions={{ duration: 4000 }} /><Routes><Route path="/login" element={<Login />} /><Route element={<AdminLayout />}><Route path="/" element={<Home />} /><Route path="/entidades" element={<ListaEntidades />} /><Route path="/entidades/novo" element={<CadastroEntidade />} /><Route path="/entidades/editar/:id" element={<EditarEntidade />} /><Route path="/cursos" element={<ListaCursos />} /><Route path="/cursos/novo" element={<CadastroCurso />} /><Route path="/cursos/editar/:id" element={<EditarCurso />} /><Route path="/alunos" element={<ListaAlunos />} /><Route path="/alunos/novo" element={<CadastroAluno />} /><Route path="/alunos/editar/:id" element={<EditarAluno />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></Router>;
}
