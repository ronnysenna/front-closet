// src/components/ResponsiveNavbar.jsx
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import './styles/NavbarStyles.css';
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
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const itemCount = getCartItemCount();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // 'md' é um bom breakpoint para alternar
  const open = Boolean(anchorEl);
  const menuId = 'primary-search-account-menu';
  
  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Efeito para animar o badge do carrinho quando o número de itens muda
  useEffect(() => {
    const badgeElement = document.querySelector('.MuiBadge-badge');
    if (badgeElement && itemCount > 0) {
      badgeElement.classList.add('cart-badge-animated');
      const timeout = setTimeout(() => {
        badgeElement.classList.remove('cart-badge-animated');
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [itemCount]);

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

  // Removemos as categorias da navbar principal

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Feedback', icon: <FavoriteIcon sx={{ color: '#e91e63' }} />, path: '/feedback' },
  ];

  const drawer = (
    <Box sx={{ 
      textAlign: 'center', 
      width: 280,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#1A1A2E',
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2, 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        bgcolor: 'rgba(255, 105, 35, 0.1)'
      }}>
        <Typography 
          variant="h5" 
          component={RouterLink}
          to="/"
          onClick={() => setMobileOpen(false)}
          sx={{ 
            py: 1.5, 
            color: '#FFFFFF', 
            fontWeight: 700,
            letterSpacing: '.1rem',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.light',
            },
          }}
        >
          Closet Moda Fitness
        </Typography>
      </Box>
      <List sx={{ 
        flex: 1, 
        pt: 2,
        px: 1.5,
      }}>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigation(item.path)}
            sx={{ 
              borderRadius: 2,
              mb: 0.5,
              transition: 'all 0.2s ease',
              bgcolor: isActivePath(item.path) ? 'rgba(255, 105, 35, 0.08)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 105, 35, 0.08)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: 'primary.light',
                minWidth: '40px',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#FFFFFF'
              }} 
            />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* Opções de autenticação no menu móvel */}
        {isAuthenticated ? (
          <>
            <ListItem 
              button 
              onClick={handleProfile}
              sx={{ 
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 105, 35, 0.08)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'primary.light', minWidth: '40px' }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Meu Perfil" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#FFFFFF'
                }}
              />
            </ListItem>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 105, 35, 0.08)',
                  transform: 'translateX(5px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'primary.light', minWidth: '40px' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Sair" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: '#FFFFFF'
                }}
              />
            </ListItem>
          </>
        ) : (
          <ListItem 
            button 
            onClick={() => handleNavigation('/login')}
            sx={{ 
              borderRadius: 2,
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 105, 35, 0.08)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.light', minWidth: '40px' }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Login" 
              primaryTypographyProps={{ 
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#FFFFFF'
              }}
            />
          </ListItem>
        )}
      </List>
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            navigate('/cart');
            setMobileOpen(false);
          }}
          startIcon={<ShoppingCartIcon />}
          sx={{
            borderRadius: 2,
            py: 1.2,
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(255, 105, 35, 0.25)',
          }}
        >
          Carrinho {itemCount > 0 ? `(${itemCount})` : ''}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#1A1A2E', // Cor de fundo escura azul-marinho profundo
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          transition: 'all 0.3s ease',
          width: '100%',
          padding: 0,
          left: 0,
          right: 0,
          '&:hover': {
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)'
          }
        }}
        elevation={0}
      >
        <Toolbar sx={{ py: 0.5, maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            className="logo-pulse"
            sx={{
              mr: 2,
              flexGrow: { xs: 1, md: 0 },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: '#FFFFFF',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              '&:hover': {
                color: 'primary.light',
                transform: 'translateY(-2px)',
                textShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                left: '-14px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              transition: 'transform 0.3s ease, color 0.3s ease',
            }}
          >
            Closet Moda Fitness
          </Typography>

          {/* Links para Desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                className={`menu-item-hover-effect modern-ripple ${isActivePath(item.path) ? 'active' : ''}`}
                sx={{ 
                  my: 2, 
                  color: isActivePath(item.path) ? 'primary.light' : '#FFFFFF', 
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1.2, 
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  py: 0.8,
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: isActivePath(item.path) ? 'rgba(255, 105, 35, 0.08)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 105, 35, 0.08)',
                    color: 'primary.main',
                    transform: 'translateY(-2px)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    width: 0,
                    height: 3,
                    backgroundColor: 'primary.main',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(-50%)',
                    borderRadius: '3px 3px 0 0',
                    opacity: 0,
                  },
                  '&:hover::after': {
                    width: '70%',
                    opacity: 1,
                  },
                  transition: 'all 0.2s ease',
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {/* Botões de autenticação para Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/login"
                  className="button-elevation"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    ml: 1,
                    borderRadius: 2,
                    px: 2.5,
                    py: 1,
                    border: '1.5px solid',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 105, 35, 0.08)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 4px 8px rgba(255, 105, 35, 0.15)',
                    },
                    transition: 'all 0.2s ease',
                  }}
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
                  sx={{ 
                    ml: 1,
                    border: '1.5px solid',
                    borderColor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                    width: 42,
                    height: 42,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 105, 35, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(255, 105, 35, 0.15)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <AccountCircleIcon fontSize="small" />
                </IconButton>
                <Menu
                  id={menuId}
                  anchorEl={anchorEl}
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: 2,
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      mt: 1.5,
                      border: '1px solid rgba(229, 231, 235, 0.8)',
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: -6,
                        right: 14,
                        width: 12,
                        height: 12,
                        bgcolor: 'background.paper',
                        transform: 'rotate(45deg)',
                        borderTop: '1px solid rgba(229, 231, 235, 0.8)',
                        borderLeft: '1px solid rgba(229, 231, 235, 0.8)',
                        zIndex: 0,
                      }
                    },
                    '& .MuiMenuItem-root': {
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.25,
                      px: 1.5,
                      transition: 'all 0.1s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 105, 35, 0.08)',
                      }
                    }
                  }}
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
                  transitionDuration={200}
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
            className="button-elevation"
            sx={{ 
              ml: { xs: 0, md: 1 },
              bgcolor: 'rgba(255, 105, 35, 0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 105, 35, 0.16)',
                transform: 'translateY(-2px)'
              },
              width: 42,
              height: 42
            }}
          >
            <Badge 
              badgeContent={itemCount} 
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 'bold',
                  minWidth: 18,
                  height: 18,
                  padding: '0 4px',
                  fontSize: 10
                }
              }}
            >
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* Ícone do Menu Hamburguer para Mobile */}
          <IconButton
            color="primary"
            aria-label="Abrir menu"
            edge="end" // Para alinhar à direita no mobile, antes do carrinho
            onClick={handleDrawerToggle}
            sx={{ 
              display: { md: 'none' }, 
              ml: 1,
              bgcolor: 'rgba(255, 105, 35, 0.08)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(255, 105, 35, 0.16)',
              },
              width: 42,
              height: 42
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Toolbar>
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
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              boxShadow: '-8px 0px 20px rgba(0, 0, 0, 0.1)',
              border: 'none',
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(2px)',
            }
          }}
          transitionDuration={{
            enter: 400,
            exit: 300
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default ResponsiveNavbar;
