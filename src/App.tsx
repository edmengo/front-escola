import { BrowserRouter as Router, Routes, Route, Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
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

import { Toaster } from 'react-hot-toast';
import { limparSessao, sessaoAtiva } from './api';

// 1. O Componente AdminLayout agora também protege as rotas
function AdminLayout() {
  const navigate = useNavigate();
  
  if (!sessaoAtiva()) {
    return <Navigate to="/login" replace />;
  }

  // Função para fazer logout
  const handleLogout = () => {
    limparSessao();
    navigate('/login'); // Manda de volta pro login
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* MENU LATERAL (Sidebar) */}
      <nav style={{ 
        width: '250px', 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column' // Adicionado para empurrar o botão de sair para baixo
      }}>
        <h2>Painel Admin</h2>
        
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px', flex: 1 }}>
          <li style={{ marginBottom: '15px' }}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Início</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/entidades" style={{ color: 'white', textDecoration: 'none' }}>🏢 Entidades</Link></li>
          <li style={{ marginBottom: '15px' }}><Link to="/cursos" style={{ color: 'white', textDecoration: 'none' }}>📚 Cursos</Link></li> 
          <li style={{ marginBottom: '15px' }}><Link to="/alunos" style={{ color: 'white', textDecoration: 'none' }}>👨‍🎓 Alunos</Link></li>
        </ul>

        {/* Botão de Sair no final do menu */}
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px',
            backgroundColor: '#dc2626', // Vermelho tailwind
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: 'auto' // Joga o botão pro fundo
          }}
        >
          🚪 Sair do Sistema
        </button>
      </nav>

      {/* ÁREA DE CONTEÚDO */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f4f4f4', color: '#333' }}>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      
      <Routes>
        {/* ROTA PÚBLICA */}
        <Route path="/login" element={<Login />} />

        {/* ROTAS PRIVADAS E PROTEGIDAS */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Home />} />
          
          <Route path="/entidades" element={<ListaEntidades />} />
          <Route path="/entidades/novo" element={<CadastroEntidade />} />
          <Route path="/entidades/editar/:id" element={<EditarEntidade />} />
          
          <Route path="/cursos" element={<ListaCursos />} />
          <Route path="/cursos/novo" element={<CadastroCurso />} />
          <Route path="/cursos/editar/:id" element={<EditarCurso />} />

          <Route path="/alunos" element={<ListaAlunos />} />
          <Route path="/alunos/novo" element={<CadastroAluno />} />
          <Route path="/alunos/editar/:id" element={<EditarAluno />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
