import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DadoGrafico { dia: string; cadastros: number }

export default function GraficoCadastros({ dados }: { dados: DadoGrafico[] }) {
  if (!dados.length) return <p className="h-72 flex items-center justify-center text-gray-500">Ainda não há dados históricos para exibir.</p>;
  return <div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dados} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="dia" stroke="#888888" /><YAxis stroke="#888888" /><Tooltip /><Area type="monotone" dataKey="cadastros" stroke="#3b82f6" fill="#93c5fd" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>;
}
