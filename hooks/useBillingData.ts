
import { useState, useMemo, useCallback } from 'react';
import { BillingRecord, Filters, SortConfig } from '../types';

export const useBillingData = (allData: BillingRecord[]) => {
    const [filters, setFilters] = useState<Filters>({
        customerName: '',
        productLine: 'all',
        year: 'all',
        month: 'all',
    });
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const uniqueValues = useMemo(() => {
        if (!allData || allData.length === 0) {
             return { customers: [], productLines: [], years: [] };
        }
        const customers = [...new Set(allData.map(item => item.customerName))];
        const productLines = [...new Set(allData.map(item => item.productLine))];
        const years = [...new Set(allData.map(item => item.year.toString()))];
        customers.sort();
        productLines.sort();
        years.sort((a,b) => parseInt(b) - parseInt(a));
        return { customers, productLines, years };
    }, [allData]);
    
    const filteredData = useMemo(() => {
        if (!allData) return [];
        return allData.filter(item => {
            const issueDate = new Date(item.issueDate);
            const itemMonth = (issueDate.getUTCMonth() + 1).toString();
            const itemYear = issueDate.getUTCFullYear().toString();

            const customerMatch = item.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
            const productLineMatch = filters.productLine === 'all' || item.productLine === filters.productLine;
            const yearMatch = filters.year === 'all' || itemYear === filters.year;
            const monthMatch = filters.month === 'all' || itemMonth === filters.month;
            
            return customerMatch && productLineMatch && yearMatch && monthMatch;
        });
    }, [allData, filters]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(sortedData.length / itemsPerPage);
    }, [sortedData.length]);

    const requestSort = (key: keyof BillingRecord) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1); // Reset to first page on filter change
    }, []);
    
    const reset = useCallback(() => {
        setFilters({
            customerName: '',
            productLine: 'all',
            year: 'all',
            month: 'all',
        });
        setSortConfig(null);
        setCurrentPage(1);
    }, []);


    return {
        paginatedData,
        filteredData, // For charts and summary
        filters,
        handleFilterChange,
        uniqueValues,
        requestSort,
        sortConfig,
        currentPage,
        setCurrentPage,
        totalPages,
        reset,
    };
};
