import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Token, FilterOptions, PaginatedResponse } from '../types/token';

interface UseTokenAPIReturn {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useTokenAPI = (filters: FilterOptions): UseTokenAPIReturn => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTokens = useCallback(async (pageNum: number = 1, reset: boolean = true) => {
    try {
      if (reset) {
        setLoading(true);
      }
      setError(null);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '50',
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      // Add optional filters
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.minMarketCap > 0) {
        params.append('minMarketCap', filters.minMarketCap.toString());
      }
      if (filters.maxMarketCap > 0) {
        params.append('maxMarketCap', filters.maxMarketCap.toString());
      }

      const response = await axios.get<PaginatedResponse<Token[]>>(
        `${API_BASE_URL}/api/tokens?${params.toString()}`,
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const newTokens = response.data.data;
        
        if (reset) {
          setTokens(newTokens);
        } else {
          setTokens(prev => [...prev, ...newTokens]);
        }

        setHasMore(response.data.pagination.hasNextPage);
        setPage(pageNum);
      } else {
        throw new Error(response.data.error || 'Failed to fetch tokens');
      }
    } catch (err) {
      console.error('Error fetching tokens:', err);
      
      let errorMessage = 'Failed to load tokens';
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout - please try again';
        } else if (err.response?.status === 404) {
          errorMessage = 'API endpoint not found';
        } else if (err.response?.status && err.response.status >= 500) {
          errorMessage = 'Server error - please try again later';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refetch = useCallback(() => {
    setPage(1);
    fetchTokens(1, true);
  }, [fetchTokens]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      fetchTokens(nextPage, false);
    }
  }, [loading, hasMore, page, fetchTokens]);

  // Fetch tokens when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 500); // Debounce search requests

    return () => clearTimeout(timeoutId);
  }, [refetch]);

  // Auto-refresh tokens every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refetch]);

  return {
    tokens,
    loading,
    error,
    refetch,
    loadMore,
    hasMore
  };
}; 