import { instance } from '../../shared/api/axiosInstance';

export const createOrderService = async (orderPayload) => {
  try {
    const token = localStorage.getItem('token');

    const response = await instance.post('/api/orders', orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: response.data,
      error: null,
      status: response.status,
    };

  } catch (error) {
    console.error('Error API:', error);

    let message = 'Error al procesar la orden';
    const status = error.response?.status || 500;

    if (error.response?.data) {
      const data = error.response.data;

      if (data.errors) {
        message = Object.values(data.errors).flat().join('\n');
      } else if (data.error || data.message) {
        message = data.error || data.message;
      } else if (data.title) {
        message = data.title;
      }
    } else if (error.request) {
      message = 'No hubo respuesta del servidor.';
    }

    return {
      data: null,
      error: message,
      status,
    };
  }
};
