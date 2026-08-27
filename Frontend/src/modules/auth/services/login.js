import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  try {
    const response = await instance.post('/api/login', {
      username,
      password,
    });

    const { token, userInfo } = response.data;

    return {
      data: {
        token,
        userInfo,
      },
      error: null,
    };

  } catch (error) {
    console.error('Error en login:', error);

    return { data: null, error };
  }
};
