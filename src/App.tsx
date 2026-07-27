import { useEffect, useState } from 'react';
import { api } from './api';

// Reaproveitando a interface que você tem no back-end
interface Escola {
  id: number;
  nome: string;
}

function App() {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Função que vai lá na sua API buscar os dados
    const carregarEscolas = async () => {
      try {
        const response = await api.get('/escolas');
        setEscolas(response.data);
      } catch (err: any) {
        setErro('Erro ao carregar os dados. Verifique se a API está online.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarEscolas();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Painel Administrativo</h1>
      <h2>Lista de Escolas</h2>

      {loading && <p>Carregando dados da nuvem...</p>}
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {!loading && !erro && escolas.length === 0 && (
        <p>Nenhuma escola cadastrada ainda.</p>
      )}

      <ul>
        {escolas.map((escola) => (
          <li key={escola.id} style={{ marginBottom: '10px' }}>
            <strong>ID:</strong> {escola.id} | <strong>Nome:</strong> {escola.nome}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;