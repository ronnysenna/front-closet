// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CartProvider já está no main.jsx envolvendo o App
import CatalogoPage from './pages/CatalogoPage';

import Box from '@mui/material/Box'; // Para ajudar no layout do footer

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box component="main" sx={{ flexGrow: 1 }}> {/* Conteúdo principal cresce */}
          <Routes>
            <Route path="/catalogo" element={<CatalogoPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;