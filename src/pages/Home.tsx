import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, mensagemErro } from '../api';

const GraficoCadastros = lazy(() => import('../components/GraficoCadastros'));
interface DadoGrafico { dia: string; cadastros: number }
interface ResumoDashboard {
  totais: { escolas: number; cursos: number; alunos: number };
  alunosUltimosSeteDias: DadoGrafico[];
}

const formatarDia = (dia: string) => {
  const [, mes, data] = dia.split('-');
  return `${data}/${mes}`;
};

export default function Home() {
  const [totais, setTotais] = useState({ escolas: 0, cursos: 0, alunos: 0 });
  const [dadosGrafico, setDadosGrafico] = useState<DadoGrafico[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const carregar = async () => { try { const { data } = await api.get<ResumoDashboard>('/dashboard/resumo'); setTotais(data.totais); setDadosGrafico(data.alunosUltimosSeteDias.map((item) => ({ ...item, dia: formatarDia(item.dia) }))); } catch (error: unknown) { toast.error(mensagemErro(error, 'Erro ao carregar os dados do painel.')); } finally { setLoading(false); } }; void carregar(); }, []);
  const indicadores = [{ titulo: 'Entidades ativas', valor: totais.escolas, descricao: 'Unidades cadastradas', icone: '◈', tom: 'blue' }, { titulo: 'Cursos disponíveis', valor: totais.cursos, descricao: 'Ofertas de ensino', icone: '▤', tom: 'violet' }, { titulo: 'Alunos registrados', valor: totais.alunos, descricao: 'Base acadêmica atual', icone: '◉', tom: 'emerald' }];
  return <div className="dashboard"><div className="dashboard-header"><div><span className="section-kicker">VISÃO GERAL</span><h1>Painel da instituição</h1><p>Acompanhe os principais indicadores da sua instituição.</p></div><div className="period-chip"><span className="pulse" /> Dados atualizados agora</div></div><section className="metric-grid">{indicadores.map((item) => <article key={item.titulo} className={`metric-card metric-${item.tom}`}><div className="metric-icon">{item.icone}</div><div><p>{item.titulo}</p><strong>{loading ? '—' : item.valor.toLocaleString('pt-BR')}</strong><small>{item.descricao}</small></div></article>)}</section><section className="dashboard-grid"><article className="analytics-card"><div className="card-heading"><div><span className="section-kicker">ANÁLISE</span><h2>Alunos cadastrados nos últimos 7 dias</h2></div><span className="muted-label">Últimos 7 dias</span></div><Suspense fallback={<p className="chart-placeholder">Carregando análise...</p>}><GraficoCadastros dados={dadosGrafico} /></Suspense></article><aside className="quick-panel"><div><span className="section-kicker">ATALHOS</span><h2>Operações frequentes</h2><p>Crie registros e mantenha a base sempre atualizada.</p></div><div className="quick-links"><Link to="/entidades/novo"><span className="quick-icon blue">◈</span><span><strong>Nova entidade</strong><small>Cadastre uma unidade</small></span><b>→</b></Link><Link to="/cursos/novo"><span className="quick-icon violet">▤</span><span><strong>Novo curso</strong><small>Amplie as ofertas</small></span><b>→</b></Link><Link to="/alunos/novo"><span className="quick-icon emerald">◉</span><span><strong>Novo aluno</strong><small>Inclua na instituição</small></span><b>→</b></Link></div></aside></section></div>;
}
