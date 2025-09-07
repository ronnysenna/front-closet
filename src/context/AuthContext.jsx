import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser as apiLoginUser,
  logoutUser as apiLogoutUser,
  getUserProfile,
  updateUserProfile,
} from "../utils/api";

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
        const token = localStorage.getItem("authToken");
        if (token) {
          const userData = await getUserProfile();
          setUser(userData);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        // Remove o token se ele for inválido
        localStorage.removeItem("authToken");
        setError("Sessão expirada. Por favor, faça login novamente.");
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
      console.log(`AuthContext: Tentando login com ${email}`);
      const data = await apiLoginUser(email, password);
      console.log("AuthContext: Login bem-sucedido", data);
      setUser(data.user);
      return data;
    } catch (err) {
      console.error("AuthContext: Erro no login:", err);
      // Defina uma mensagem de erro mais clara para o usuário
      const errorMsg = err.message || "Falha na autenticação.";
      setError(errorMsg);
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
  const isAdmin = user?.role === "ADMIN";

  // Função para atualizar o perfil do usuário
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUserProfile(userData);
      setUser(updatedUser.user);
      return updatedUser;
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      const errorMsg = err.message || "Falha ao atualizar perfil.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valor do contexto
  const authContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
