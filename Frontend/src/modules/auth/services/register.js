import { instance } from '../../shared/api/axiosInstance';

export const registerUser = async (payload) => {
  try {
    const response = await instance.post('/api/register', payload);

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || 'Error al registrar' };
  }
};
