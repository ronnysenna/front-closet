// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CartProvider já está no main.jsx envolvendo o App
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage'; // Importe a nova página
import Box from '@mui/material/Box'; // Para ajudar no layout do footer

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}> {/* Conteúdo principal cresce */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} /> {/* Nova rota para detalhes do produto */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;