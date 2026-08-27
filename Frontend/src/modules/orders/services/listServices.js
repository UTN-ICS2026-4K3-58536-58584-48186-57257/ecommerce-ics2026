import { instance as api } from '../../shared/api/axiosInstance';

export async function getOrders(
  searchTerm = '',
  status = 'all',
  pageNumber = 1,
  pageSize = 10,
) {
  try {
    const params = { pageNumber, pageSize };

    if (searchTerm) params.searchTerm = searchTerm;

    if (status && status !== 'all') params.status = status;

    const response = await api.get('/api/orders', { params });

    return {
      items: response.data.items,
      total: response.data.total,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      error: error.response?.data || 'Error al obtener órdenes',
    };
  }
}
