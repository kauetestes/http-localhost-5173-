
import React from 'react';
import { Filters } from '../types';
import { FilterIcon } from './icons';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  uniqueValues: {
    customers: string[];
    productLines: string[];
    years: string[];
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, uniqueValues }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };
  
  const resetFilters = () => {
    onFilterChange({
        customerName: '',
        productLine: 'all',
        year: 'all',
        month: 'all'
    });
  };

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, name: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }) }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
      <div className="flex items-center mb-4 text-lg font-semibold text-white">
        <FilterIcon />
        <h3 className="ml-2">Filtros</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Customer Name Search */}
        <div className="flex flex-col">
          <label htmlFor="customerName" className="text-sm font-medium text-slate-300 mb-1">Nome do Cliente</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={filters.customerName}
            onChange={handleInputChange}
            placeholder="Pesquisar cliente..."
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
          />
        </div>

        {/* Product Line Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="productLine" className="text-sm font-medium text-slate-300 mb-1">Linha de Produto</label>
          <select
            id="productLine"
            name="productLine"
            value={filters.productLine}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
          >
            <option value="all">Todas as Linhas</option>
            {uniqueValues.productLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="year" className="text-sm font-medium text-slate-300 mb-1">Ano</label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
          >
            <option value="all">Todos os Anos</option>
            {uniqueValues.years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="month" className="text-sm font-medium text-slate-300 mb-1">Mês</label>
          <select
            id="month"
            name="month"
            value={filters.month}
            onChange={handleInputChange}
            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-brand-secondary focus:border-brand-secondary block w-full p-2.5"
          >
            <option value="all">Todos os Meses</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.name.charAt(0).toUpperCase() + month.name.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex flex-col justify-end">
            <button
                onClick={resetFilters}
                className="w-full text-white bg-slate-700 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-slate-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
                Limpar Filtros
            </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
