
import React from 'react';
import { BillingRecord, SortConfig } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from './icons';

interface BillingTableProps {
  data: BillingRecord[];
  requestSort: (key: keyof BillingRecord) => void;
  sortConfig: SortConfig;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const TableHeader: React.FC<{
  title: string;
  sortKey: keyof BillingRecord;
  requestSort: (key: keyof BillingRecord) => void;
  sortConfig: SortConfig;
}> = ({ title, sortKey, requestSort, sortConfig }) => {
  const isSorted = sortConfig?.key === sortKey;
  const direction = isSorted ? sortConfig.direction : undefined;

  return (
    <th scope="col" className="px-6 py-3">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => requestSort(sortKey)}
      >
        {title}
        <span className="ml-1">
            {isSorted ? (direction === 'ascending' ? <ChevronUpIcon/> : <ChevronDownIcon/>) : <div className="h-4 w-4 opacity-30"><ChevronUpIcon/></div>}
        </span>
      </div>
    </th>
  );
};

const BillingTable: React.FC<BillingTableProps> = ({ data, requestSort, sortConfig, currentPage, setCurrentPage, totalPages }) => {
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
            <tr>
              <TableHeader title="Cliente" sortKey="customerName" requestSort={requestSort} sortConfig={sortConfig} />
              <TableHeader title="Produto" sortKey="productDescription" requestSort={requestSort} sortConfig={sortConfig} />
              <TableHeader title="Data" sortKey="issueDate" requestSort={requestSort} sortConfig={sortConfig} />
              <TableHeader title="Qtd." sortKey="quantity" requestSort={requestSort} sortConfig={sortConfig} />
              <TableHeader title="Valor Unit." sortKey="unitPrice" requestSort={requestSort} sortConfig={sortConfig} />
              <TableHeader title="Valor Total" sortKey="totalValue" requestSort={requestSort} sortConfig={sortConfig} />
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map(item => (
                <tr key={item.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.customerName}</td>
                  <td className="px-6 py-4">{item.productDescription}</td>
                  <td className="px-6 py-4">{formatDate(item.issueDate)}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-6 py-4 font-bold">{formatCurrency(item.totalValue)}</td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">Nenhum registro encontrado.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
       {totalPages > 1 && (
        <div className="flex justify-between items-center p-4">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-500"
            >
                Anterior
            </button>
            <span className="text-sm text-slate-400">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-500"
            >
                Próximo
            </button>
        </div>
      )}
    </div>
  );
};

export default BillingTable;
