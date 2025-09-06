import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import "./styles/NavbarStyles.css";
import "./styles/FullWidthLayout.css";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ResponsiveNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { getCartItemCount } = useCart();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const itemCount = getCartItemCount();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 'md' é um bom breakpoint para alternar
  const open = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

  const isActivePath = (path) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(path))
    );
  };

  // Efeito para animar o badge do carrinho quando o número de itens muda
  useEffect(() => {
    const badgeElement = document.querySelector(".MuiBadge-badge");
    if (badgeElement && itemCount > 0) {
      badgeElement.classList.add("cart-badge-animated");
      const timeout = setTimeout(() => {
        badgeElement.classList.remove("cart-badge-animated");
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
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  // Removemos as categorias da navbar principal

  const navItems = [
    {
      text: "Home",
      icon: <HomeRoundedIcon sx={{ color: "#ff6923" }} />,
      path: "/",
    },
    {
      text: "Feedback",
      icon: <FavoriteRoundedIcon sx={{ color: "#e91e63" }} />, // Rosa vibrante
      path: "/feedback",
    },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon sx={{ color: "#E1306C", fontSize: 28 }} />,
      url: "https://www.instagram.com/closettmodafitness_?igsh=MTB1b3c5NWRlYm1kZA==",
    },
    {
      icon: <FacebookIcon sx={{ color: "#1877F3", fontSize: 28 }} />,
      url: "https://facebook.com/closettmodafitness",
    },
    {
      icon: <WhatsAppIcon sx={{ color: "#25D366", fontSize: 28 }} />,
      url: "https://wa.me/5585991893149",
    },
  ];

  const drawer = (
    <Box
      sx={{
        textAlign: "center",
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1A1A2E",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          bgcolor: "rgba(255, 105, 35, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          onClick={() => setMobileOpen(false)}
          sx={{
            py: 1.5,
            color: "#FFFFFF",
            fontWeight: 700,
            letterSpacing: ".1rem",
            textDecoration: "none",
            "&:hover": {
              color: "primary.light",
            },
          }}
        >
          Closet Moda Fitness
        </Typography>
      </Box>
      <List
        sx={{
          flex: 1,
          pt: 2,
          px: 1.5,
        }}
      >
        {navItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              transition: "all 0.2s ease",
              bgcolor: isActivePath(item.path)
                ? "rgba(255, 105, 35, 0.08)"
                : "transparent",
              "&:hover": {
                bgcolor: "rgba(255, 105, 35, 0.08)",
                transform: "translateX(5px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActivePath(item.path) ? "#ff6923" : "#B3B3B3",
                minWidth: "40px",
                transition: "color 0.2s",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#FFFFFF",
              }}
            />
          </ListItem>
        ))}

        <Divider sx={{ my: 2, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Opções de autenticação no menu móvel */}
        {isAuthenticated ? (
          <>
            <ListItem
              button
              onClick={handleProfile}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 105, 35, 0.08)",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#1976d2", minWidth: "40px" }}>
                <PersonRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Meu Perfil"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "#FFFFFF",
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 105, 35, 0.08)",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#e53935", minWidth: "40px" }}>
                <LogoutRoundedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "#FFFFFF",
                }}
              />
            </ListItem>
          </>
        ) : (
          <ListItem
            button
            onClick={() => handleNavigation("/login")}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 105, 35, 0.08)",
                transform: "translateX(5px)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#1976d2", minWidth: "40px" }}>
              <LoginRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Login"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#FFFFFF",
              }}
            />
          </ListItem>
        )}
      </List>
      <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/cart");
            setMobileOpen(false);
          }}
          startIcon={<ShoppingCartRoundedIcon sx={{ color: "#43a047" }} />}
          sx={{
            borderRadius: 2,
            py: 1.2,
            fontWeight: 600,
            boxShadow: "0 4px 10px rgba(255, 105, 35, 0.25)",
          }}
        >
          Carrinho {itemCount > 0 ? `(${itemCount})` : ""}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        className="full-width-container"
        sx={{
          bgcolor: "#1A1A2E", // Mesma cor do Footer
          color: "#fff",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
          borderBottom: "1px solid #23234a",
          width: "100vw",
          padding: 0,
          margin: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
        elevation={0}
      >
        <Toolbar className="content-container" sx={{ py: 0.5, width: "100%" }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              mr: 2,
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <Box
              component="img"
              src="/image/cmf-preto.png"
              alt="Closet Moda Fitness Logo"
              sx={{ height: 144, width: "auto", mr: 1, display: "block" }}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  my: 2,
                  color: isActivePath(item.path) ? "#ff6923" : "#fff",
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  mx: 1,
                  background: isActivePath(item.path)
                    ? "rgba(255, 105, 35, 0.10)"
                    : "transparent",
                  boxShadow: isActivePath(item.path)
                    ? "0 2px 8px rgba(255, 105, 35, 0.10)"
                    : "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "rgba(255, 105, 35, 0.18)",
                    color: "#ff6923",
                    transform: "translateY(-2px) scale(1.04)",
                    boxShadow: "0 4px 16px rgba(255, 105, 35, 0.15)",
                  },
                }}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1.5,
              ml: 2,
            }}
          >
            {socialLinks.map((social) => (
              <IconButton
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener"
                sx={{
                  bgcolor: "transparent",
                  color: "#fff",
                  "&:hover": { bgcolor: "#23234a" },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {!isAuthenticated ? (
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/login"
                className="button-elevation"
                startIcon={<LoginRoundedIcon />}
                sx={{
                  ml: 1,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  border: "1.5px solid",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "rgba(255, 105, 35, 0.08)",
                    borderColor: "primary.main",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 8px rgba(255, 105, 35, 0.15)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Login
              </Button>
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
                    border: "1.5px solid",
                    borderColor: "primary.main",
                    borderRadius: "50%",
                    p: 1,
                    width: 42,
                    height: 42,
                    "&:hover": {
                      backgroundColor: "rgba(255, 105, 35, 0.08)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 8px rgba(255, 105, 35, 0.15)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <PersonRoundedIcon fontSize="small" />
                </IconButton>
                <Menu
                  id={menuId}
                  anchorEl={anchorEl}
                  sx={{
                    "& .MuiPaper-root": {
                      borderRadius: 2,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      mt: 1.5,
                      border: "1px solid rgba(229, 231, 235, 0.8)",
                      overflow: "visible",
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: -6,
                        right: 14,
                        width: 12,
                        height: 12,
                        bgcolor: "background.paper",
                        transform: "rotate(45deg)",
                        borderTop: "1px solid rgba(229, 231, 235, 0.8)",
                        borderLeft: "1px solid rgba(229, 231, 235, 0.8)",
                        zIndex: 0,
                      },
                    },
                    "& .MuiMenuItem-root": {
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.25,
                      px: 1.5,
                      transition: "all 0.1s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 105, 35, 0.08)",
                      },
                    },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                  transitionDuration={200}
                >
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <PersonRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Meu Perfil</ListItemText>
                  </MenuItem>

                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/admin");
                      }}
                    >
                      <ListItemIcon>
                        <CategoryRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Painel Admin</ListItemText>
                    </MenuItem>
                  )}

                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutRoundedIcon fontSize="small" />
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
            onClick={() => navigate("/cart")}
            className="button-elevation"
            sx={{
              ml: { xs: 0, md: 1 },
              bgcolor: "rgba(255, 105, 35, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 105, 35, 0.16)",
                transform: "translateY(-2px)",
              },
              width: 42,
              height: 42,
            }}
          >
            <Badge
              badgeContent={itemCount}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  fontWeight: "bold",
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  fontSize: 10,
                },
              }}
            >
              <ShoppingCartRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>

          {/* Ícone do Menu Hamburguer para Mobile */}
          <IconButton
            color="primary"
            aria-label="Abrir menu"
            edge="end" // Para alinhar à direita no mobile, antes do carrinho
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              ml: 1,
              bgcolor: "rgba(255, 105, 35, 0.08)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 105, 35, 0.16)",
              },
              width: 42,
              height: 42,
            }}
          >
            <MenuOpenRoundedIcon fontSize="small" />
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
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
              boxShadow: "-8px 0px 20px rgba(0, 0, 0, 0.1)",
              border: "none",
            },
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(2px)",
            },
          }}
          transitionDuration={{
            enter: 400,
            exit: 300,
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default ResponsiveNavbar;
