// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// CartProvider já está no main.jsx envolvendo o App
import Header from './components/Header';
import FeedbackPage from './pages/FeedbackPage';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePlaceholder from './pages/ProfilePlaceholder';
import AdminDashboard from './pages/AdminDashboard';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import { Box, Container, Typography } from '@mui/material'; // Para ajudar no layout do footer

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}> {/* Conteúdo principal cresce */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/categoria/:category" element={<CategoryPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            
            {/* Novas rotas de autenticação */}
            <Route path="/login" element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            } />
            
            {/* Página de perfil protegida */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePlaceholder />
              </ProtectedRoute>
            } />
            
            {/* Painel de administração */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Página de acesso não autorizado */}
            <Route path="/unauthorized" element={
              <Container maxWidth="md" sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h4" color="error">
                  Acesso Negado
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Você não tem permissão para acessar esta página.
                </Typography>
              </Container>
            } />
            
            {/* Rota para página 404 - não encontrada */}
            <Route path="*" element={
              <Container maxWidth="md" sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h4">
                  Página não encontrada
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  A página que você está procurando não existe.
                </Typography>
              </Container>
            } />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;