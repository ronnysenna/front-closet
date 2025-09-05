
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme'; // Importe seu tema customizado
import { CartProvider } from './context/CartContext.jsx'; // Mantenha seu CartProvider
import { AuthProvider } from './context/AuthContext.jsx'; // Novo provedor de autenticação

// Seu arquivo CSS global, se tiver (para estilos que não são do MUI)
import './App.css'; 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza estilos e aplica alguns padrões MUI */}
      <AuthProvider> {/* Provedor de autenticação */}
        <CartProvider> {/* Envolve o App com o CartProvider */}
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);