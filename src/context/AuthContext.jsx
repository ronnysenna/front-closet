import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser as apiLoginUser, logoutUser as apiLogoutUser, getUserProfile } from '../utils/api';

// Criando o contexto de autenticação
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Componente provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se há um token na inicialização e carrega o perfil do usuário
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (token) {
          const userData = await getUserProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        // Remove o token se ele for inválido
        localStorage.removeItem('authToken');
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiLoginUser(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Falha na autenticação.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    apiLogoutUser();
    setUser(null);
  };

  // Verifica se o usuário está autenticado
  const isAuthenticated = !!user;

  // Verifica se o usuário é admin
  const isAdmin = user?.role === 'ADMIN';

  // Valor do contexto
  const authContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
