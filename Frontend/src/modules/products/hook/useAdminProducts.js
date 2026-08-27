import { useState, useEffect, useCallback } from 'react';
import { getAdminProducts } from '../services/adminList';

export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    query: '',
    status: 'all',
    page: 1,
    pageSize: 10,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { items, total, error: apiError } = await getAdminProducts(
      filters.query,
      filters.status,
      filters.page,
      filters.pageSize,
    );

    if (apiError) {
      setError(apiError);
    } else {
      setProducts(items);
      setTotalItems(total);
    }

    setLoading(false);
  }, [filters.query, filters.status, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    totalItems,
    totalPages: Math.ceil(totalItems / filters.pageSize),

    setPage: (page) => setFilters(prev => ({ ...prev, page })),
    setSearch: (term) =>
      setFilters(prev => ({ ...prev, query: term, page: 1 })),
    setStatus: (status) =>
      setFilters(prev => ({ ...prev, status, page: 1 })),
  };
}
