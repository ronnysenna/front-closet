// src/components/ResponsiveNavbar.jsx
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteIcon from '@mui/icons-material/Favorite';
// Se precisar de mais ícones para o drawer:
// import StorefrontIcon from '@mui/icons-material/Storefront';

import { useCart } from '../context/CartContext';

const ResponsiveNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 'md' é um bom breakpoint para alternar

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Categorias fixas conforme produtos.js
  const categories = [
    { text: 'Babydoll', value: 'babydoll' },
    { text: 'Camisola', value: 'camisola' },
    { text: 'Infantil', value: 'infantil' },
    { text: 'Conjunto casal', value: 'conjunto casal' },
    { text: 'Americano', value: 'americano' },
  ];

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Feedback', icon: <FavoriteIcon sx={{ color: '#e91e63' }} />, path: '/feedback' },
    // Adiciona cada categoria como item de navegação
    ...categories.map(cat => ({
      text: cat.text,
      icon: <CategoryIcon />,
      path: `/categoria/${cat.value}`
    })),
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', width: 250 }}>
      <Typography variant="h6" sx={{ my: 2, color: 'primary.main', fontWeight: 'bold' }}>
        Gofashion
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.text} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
        <Container maxWidth="lg"> {/* Ou 'xl' ou false para largura total */}
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                flexGrow: { xs: 1, md: 0 }, // Ocupa mais espaço no mobile para empurrar ícones
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'primary.main',
                textDecoration: 'none',
              }}
            >
              Gofashion
            </Typography>

            {/* Links para Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1, fontWeight: 500 }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            {/* Ícone do Carrinho */}
            <IconButton
              color="primary"
              aria-label="Abrir carrinho"
              onClick={() => navigate('/cart')}
              sx={{ ml: { xs: 0, md: 1 } }}
            >
              <Badge badgeContent={itemCount} color="secondary"> {/* 'secondary' pode ser uma boa cor para o badge */}
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Ícone do Menu Hamburguer para Mobile */}
            <IconButton
              color="primary"
              aria-label="Abrir menu"
              edge="end" // Para alinhar à direita no mobile, antes do carrinho
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer para Mobile */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right" // Abre da direita
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor performance de abertura em mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default ResponsiveNavbar;