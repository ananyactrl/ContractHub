import { useState, useEffect, useMemo } from 'react';
import { type Contract } from '../services/api';

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredContracts: Contract[];
  debouncedSearchTerm: string;
}

export const useSearch = (contracts: Contract[]): UseSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredContracts = useMemo(() => {
    if (!debouncedSearchTerm) return contracts;
    
    const term = debouncedSearchTerm.toLowerCase();
    return contracts.filter(contract => 
      contract.name.toLowerCase().includes(term) ||
      contract.parties.toLowerCase().includes(term)
    );
  }, [contracts, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredContracts,
    debouncedSearchTerm,
  };
};
