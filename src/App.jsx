// Core imports

// Material-UI components
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Styles
import './App.css';
import './components/styles/FullWidthLayout.css';

// Local components
import Footer from './components/Footer';
import Header from './components/Header';
import { GuestRoute, ProtectedRoute } from './components/ProtectedRoute';

// Lazy loading para melhorar a performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePlaceholder = lazy(() => import('./pages/ProfilePlaceholder'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Componente de Loading
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

// Componentes de Erro
const UnauthorizedPage = () => (
  <Container maxWidth="md" sx={{ my: 6, textAlign: 'center' }} className="fade-in">
    <Typography variant="h3" color="error" gutterBottom>
      Acesso Negado
    </Typography>
    <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
      Você não tem permissão para acessar esta página.
    </Typography>
    <Box
      component="img"
      src="/image/unauthorized.svg"
      alt="Acesso Negado"
      sx={{ maxWidth: '300px', width: '100%', my: 3 }}
    />
  </Container>
);

const NotFoundPage = () => (
  <Container maxWidth="md" sx={{ my: 6, textAlign: 'center' }} className="fade-in">
    <Typography variant="h3" gutterBottom>
      Página não encontrada
    </Typography>
    <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
      A página que você está procurando não existe.
    </Typography>
    <Box
      component="img"
      src="/image/not-found.svg"
      alt="Página não encontrada"
      sx={{ maxWidth: '300px', width: '100%', my: 3 }}
    />
  </Container>
);

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: { xs: 2, sm: 3 },
            pb: { xs: 4, sm: 6 },
          }}
          className="fade-in"
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/categoria/:category" element={<CategoryPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />

              {/* Rotas de autenticação */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />

              {/* Página de perfil protegida */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePlaceholder />
                  </ProtectedRoute>
                }
              />

              {/* Painel de administração */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Página de acesso não autorizado */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Rota para página 404 - não encontrada */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
