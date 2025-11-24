import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistir usuario en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Obtener perfil desde backend
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/profile');
      setUser(response.data.data.user);
      return { success: true, user: response.data.data.user };
    } catch (err) {
      console.error('Error al obtener perfil:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return { success: false, message: err.response?.data?.message || 'Error al obtener perfil' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar perfil al iniciar si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      getProfile();
    }
  }, [user, getProfile]);

  // Login con backend
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/login', { email, password });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Registro con backend
  const register = useCallback(async ({ name, email, password, confirmPassword }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/auth/register', { name, email, password, confirmPassword });
      const { token, user: userData } = response.data.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrar usuario';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError(null);
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put('/auth/profile', updates);
      setUser(response.data.data.user);
      return { success: true, user: response.data.data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al actualizar perfil';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Helpers de roles
  const isAdmin = user?.role === 'admin';
  const isCliente = user?.role === 'cliente';
  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    getProfile,
    isAdmin,
    isCliente,
    isAuthenticated,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
