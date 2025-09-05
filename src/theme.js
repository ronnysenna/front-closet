// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6923', // Sua cor rosa de destaque (brand-pink)
      contrastText: '#fff', // Cor do texto para botões primários, etc.
    },
    secondary: {
      main: '#f236897', // Outra cor, se precisar
    },
    // Você pode adicionar mais cores ou customizar outras seções da paleta
    // background: {
    //   default: '#f9fafb' // Um cinza bem claro para o fundo, como no Tailwind
    // }
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif', // Define Poppins como principal
    h1: {
      fontWeight: 700,
    },
    // Você pode customizar variantes da tipografia aqui
    // button: {
    //   textTransform: 'none' // Para não ter botões em MAIÚSCULAS por padrão
    // }
  },
  // Você pode customizar estilos de componentes globalmente aqui
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         borderRadius: 8,
  //       },
  //     },
  //   },
  // },
});