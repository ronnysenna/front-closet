import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

// Componente para rotas protegidas que requerem autenticação
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  // Mostra o indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // Redireciona para login se o usuário não está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se a rota requer permissão de admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Renderiza o conteúdo da rota protegida
  return children;
};

// Componente para rotas que são acessíveis apenas quando não autenticado (ex: login, registro)
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redireciona para a página inicial se já estiver autenticado
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default { ProtectedRoute, GuestRoute };
