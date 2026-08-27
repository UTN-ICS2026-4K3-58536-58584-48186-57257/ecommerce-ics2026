import { instance as api } from '../../shared/api/axiosInstance';

export async function getAdminProducts(
  searchTerm = '',
  status = 'all',
  pageNumber = 1,
  pageSize = 10,
) {
  try {
    const params = {
      searchTerm,
      status,
      pageNumber,
      pageSize,
    };

    const response = await api.get('/api/products/admin', { params });

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
