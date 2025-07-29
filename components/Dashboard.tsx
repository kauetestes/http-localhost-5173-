
import React, { useEffect } from 'react';
import FilterPanel from './FilterPanel';
import SummaryCards from './SummaryCards';
import BillingTable from './BillingTable';
import RevenueChart from './RevenueChart';
import { useBillingData } from '../hooks/useBillingData';
import { BillingRecord } from '../types';

interface DashboardProps {
    data: BillingRecord[];
    onReset: () => void;
    fileName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset, fileName }) => {
    const {
        paginatedData,
        filteredData,
        filters,
        handleFilterChange,
        uniqueValues,
        requestSort,
        sortConfig,
        currentPage,
        setCurrentPage,
        totalPages,
        reset
    } = useBillingData(data);

    useEffect(() => {
        reset();
    }, [data, reset]);
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard de Faturamento</h1>
                    <p className="text-slate-400 mt-1">
                        Exibindo dados de: <span className="font-semibold text-brand-secondary">{fileName}</span>
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="mt-4 sm:mt-0 text-white bg-brand-primary hover:bg-brand-secondary focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
                >
                    Carregar Novo Arquivo
                </button>
            </header>

            <FilterPanel 
                filters={filters}
                onFilterChange={handleFilterChange}
                uniqueValues={uniqueValues}
            />

            <SummaryCards data={filteredData} />

            <div className="grid grid-cols-1 gap-6">
                <RevenueChart data={filteredData} />
                <BillingTable 
                    data={paginatedData}
                    requestSort={requestSort}
                    sortConfig={sortConfig}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
};

export default Dashboard;
