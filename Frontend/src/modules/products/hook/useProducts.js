import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/list';

export function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    query: searchParams.get('search') || '',
    status: 'enabled',
    page: 1,
    pageSize: 8,
  });

  // 🔥 IMPORTANTE → useCallback
  const fetchProducts = useCallback(async () => {
    setLoading(true);

    const { items, total } = await getProducts(
      filters.query,
      filters.status,
      filters.page,
      filters.pageSize,
    );

    setProducts(items);
    setTotalItems(total);
    setLoading(false);
  }, [filters.query, filters.status, filters.page, filters.pageSize]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // ya no da warning

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';

    setFilters(prev => ({
      ...prev,
      query: urlSearch,
      page: 1,
    }));
  }, [searchParams]);

  const setPage = (page) => setFilters(prev => ({ ...prev, page }));

  const setSearch = (term) => {
    setSearchParams(term ? { search: term } : {});
  };

  const setStatus = (status) =>
    setFilters(prev => ({ ...prev, status, page: 1 }));

  return {
    products,
    loading,
    filters,
    totalItems,
    totalPages: Math.ceil(totalItems / filters.pageSize),
    setSearch,
    setPage,
    setStatus,
  };
}
