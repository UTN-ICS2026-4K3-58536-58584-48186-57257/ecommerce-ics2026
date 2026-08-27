import { instance as api } from '../../shared/api/axiosInstance';

export async function getProducts(
  searchTerm = '',
  status = 'enabled',
  pageNumber = 1,
  pageSize = 8,
) {
  try {
    const params = { pageNumber, pageSize };

    if (searchTerm) params.searchTerm = searchTerm;

    if (status) params.status = status;

    const response = await api.get('/api/products', { params });

    return {
      items: response.data.items,
      total: response.data.total,
      error: null,
    };
  } catch (error) {
    return {
      items: [],
      total: 0,
      error: error.response?.data || 'Error al obtener productos',
    };
  }
}
