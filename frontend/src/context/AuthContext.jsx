import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      API.get('/auth/me')
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete API.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    const response = await API.post('/auth/signup', userData);
    const { token, ...userDataResponse } = response.data;
    
    // Save token
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userDataResponse);
    return response.data;
  };

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    const { token, ...userDataResponse } = response.data;
    
    // Save token
    localStorage.setItem('token', token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userDataResponse);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUserBalance = (newBalance) => {
    setUser((prev) => ({
      ...prev,
      balance: newBalance
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateUserBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
