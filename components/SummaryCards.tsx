
import React, { useMemo } from 'react';
import { BillingRecord } from '../types';
import { ChartBarIcon, CubeIcon, DocumentTextIcon, UsersIcon } from './icons';

interface SummaryCardsProps {
    data: BillingRecord[];
}

const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-brand-primary/20 text-brand-secondary p-3 rounded-full">
            {icon}
        </div>
    </div>
);

const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
    const summary = useMemo(() => {
        const totalRevenue = data.reduce((acc, item) => acc + item.totalValue, 0);
        const uniqueCustomers = new Set(data.map(item => item.customerName)).size;
        const uniqueInvoices = new Set(data.map(item => item.invoiceId)).size;
        const totalItemsSold = data.reduce((acc, item) => acc + item.quantity, 0);

        return {
            totalRevenue: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            uniqueCustomers,
            uniqueInvoices,
            totalItemsSold: totalItemsSold.toLocaleString('pt-BR'),
        };
    }, [data]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard title="Faturamento Total" value={summary.totalRevenue} icon={<ChartBarIcon />} />
            <SummaryCard title="Clientes Únicos" value={summary.uniqueCustomers} icon={<UsersIcon />} />
            <SummaryCard title="Notas Fiscais" value={summary.uniqueInvoices} icon={<DocumentTextIcon />} />
            <SummaryCard title="Itens Vendidos" value={summary.totalItemsSold} icon={<CubeIcon />} />
        </div>
    );
};

export default SummaryCards;
