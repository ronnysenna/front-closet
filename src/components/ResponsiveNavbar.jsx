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
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// Se precisar de mais ícones para o drawer:
// import StorefrontIcon from '@mui/icons-material/Storefront';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ResponsiveNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { getCartItemCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const itemCount = getCartItemCount();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 'md' é um bom breakpoint para alternar
  const open = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
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
        
        <Divider sx={{ my: 1 }} />
        
        {/* Opções de autenticação no menu móvel */}
        {isAuthenticated ? (
          <>
            <ListItem button onClick={handleProfile}>
              <ListItemIcon sx={{ color: 'primary.main' }}><PersonIcon /></ListItemIcon>
              <ListItemText primary="Meu Perfil" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: 'primary.main' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={() => handleNavigation('/login')}>
            <ListItemIcon sx={{ color: 'primary.main' }}><LoginIcon /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
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

            {/* Botões de autenticação para Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={handleMenu}
                    size="large"
                    aria-label="conta do usuário"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleProfile}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Meu Perfil</ListItemText>
                    </MenuItem>
                    
                    {isAdmin && (
                      <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                        <ListItemIcon>
                          <CategoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Painel Admin</ListItemText>
                      </MenuItem>
                    )}
                    
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Sair</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
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