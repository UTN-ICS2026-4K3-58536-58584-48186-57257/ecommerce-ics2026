import { instance } from '../../shared/api/axiosInstance';

export const createProduct = async (formData) => {
  try {
    const payload = {
      sku: formData.sku,
      internalCode: formData.internalCode,
      name: formData.name,
      description: formData.description,
      currentUnitPrice: formData.price,
      stockQuantity: formData.stock,
    };

    const response = await instance.post('/api/products', payload);

    return { data: response.data, error: null };

  } catch (error) {
    console.error('Error creando producto:', error);

    return { data: null, error: error.response?.data?.message || 'Error al crear el producto' };
  }
};
