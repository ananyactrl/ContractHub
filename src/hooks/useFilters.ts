import { useState, useMemo, useEffect } from 'react';
import { type Contract } from '../services/api';

interface FilterState {
  status: string;
  risk: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface UseFiltersReturn {
  filters: FilterState;
  setStatusFilter: (status: string) => void;
  setRiskFilter: (risk: string) => void;
  setDateRange: (start: string, end: string) => void;
  clearFilters: () => void;
  filteredContracts: Contract[];
  activeFiltersCount: number;
}

export const useFilters = (contracts: Contract[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem('filters');
    if (saved) {
      try { return JSON.parse(saved) as FilterState; } catch {}
    }
    return {
      status: 'all',
      risk: 'all',
      dateRange: { start: '', end: '' },
    };
  });

  const setStatusFilter = (status: string) => {
    setFilters(prev => ({ ...prev, status }));
  };

  const setRiskFilter = (risk: string) => {
    setFilters(prev => ({ ...prev, risk }));
  };

  const setDateRange = (start: string, end: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      risk: 'all',
      dateRange: { start: '', end: '' },
    });
  };

  // Persist filters
  useEffect(() => {
    try { localStorage.setItem('filters', JSON.stringify(filters)); } catch {}
  }, [filters]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const statusMatch = filters.status === 'all' || contract.status === filters.status;
      const riskMatch = filters.risk === 'all' || contract.risk === filters.risk;
      
      let dateMatch = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        const contractDate = new Date(contract.expiry);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        dateMatch = contractDate >= startDate && contractDate <= endDate;
      }
      
      return statusMatch && riskMatch && dateMatch;
    });
  }, [contracts, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.risk !== 'all') count++;
    if (filters.dateRange.start && filters.dateRange.end) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setStatusFilter,
    setRiskFilter,
    setDateRange,
    clearFilters,
    filteredContracts,
    activeFiltersCount,
  };
};
