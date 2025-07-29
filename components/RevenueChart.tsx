
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BillingRecord } from '../types';

interface RevenueChartProps {
  data: BillingRecord[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const monthlyRevenue: { [key: string]: number } = {};

    data.forEach(item => {
      const month = item.issueDate.getUTCMonth();
      const year = item.issueDate.getUTCFullYear();
      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }
      monthlyRevenue[key] += item.totalValue;
    });
    
    return Object.keys(monthlyRevenue)
      .map(key => {
        const [year, month] = key.split('-');
        return {
          name: new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'short', year: '2-digit' }),
          Faturamento: monthlyRevenue[key],
        };
      })
      .sort((a,b) => {
        const [aYear, aMonth] = a.name.split('/').reverse().join('-');
        const [bYear, bMonth] = b.name.split('/').reverse().join('-');
        return new Date(`20${aYear}-${aMonth}-01`).getTime() - new Date(`20${bYear}-${bMonth}-01`).getTime();
      });

  }, [data]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Faturamento Mensal</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f9fafb' }}
              formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Faturamento']}
            />
            <Legend wrapperStyle={{ color: '#d1d5db' }} />
            <Bar dataKey="Faturamento" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px] text-slate-400">
          Nenhum dado para exibir com os filtros atuais.
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
