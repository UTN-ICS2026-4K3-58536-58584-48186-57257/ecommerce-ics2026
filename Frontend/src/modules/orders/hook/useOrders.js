import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../services/listServices';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    query: '',
    status: 'all',
    page: 1,
    pageSize: 10,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    const { items, total, error } = await getOrders(
      filters.query,
      filters.status,
      filters.page,
      filters.pageSize,
    );

    if (!error) {
      setOrders(items);
      setTotalItems(total);
    } else {
      console.error(error);
    }

    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const setPage = (page) => setFilters((prev) => ({ ...prev, page }));
  const setStatus = (status) =>
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  const setSearch = (term) =>
    setFilters((prev) => ({ ...prev, query: term, page: 1 }));

  return {
    orders,
    loading,
    filters,
    totalItems,
    totalPages: Math.ceil(totalItems / filters.pageSize),
    setPage,
    setStatus,
    setSearch,
  };
}
