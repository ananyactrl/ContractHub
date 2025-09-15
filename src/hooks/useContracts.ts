import { useState, useEffect, useCallback } from 'react';
import { api, type Contract } from '../services/api';

interface UseContractsReturn {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useContracts = (): UseContractsReturn => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getContracts();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    refetch: fetchContracts,
  };
};
