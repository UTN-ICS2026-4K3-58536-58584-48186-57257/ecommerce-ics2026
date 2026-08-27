import { createContext, useState } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const signout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const signin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) return { error };

    localStorage.setItem('token', data.token);

    localStorage.setItem('user', JSON.stringify(data.userInfo));

    setIsAuthenticated(true);
    setUser(data.userInfo);

    return { error: null, userInfo: data.userInfo };
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      signin,
      signout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
