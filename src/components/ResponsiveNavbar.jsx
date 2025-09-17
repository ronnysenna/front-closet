import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import "./styles/NavbarStyles.css";
import "./styles/FullWidthLayout.css";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import logoImage from "/image/Logo_F-Preto-transparent.png";
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CategoryGrid from "./CategoryGrid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ResponsiveNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoriesAnchor, setCategoriesAnchor] = useState(null);
  const { getCartItemCount } = useCart();
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const itemCount = getCartItemCount();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

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

  const handleCategoriesOpen = (event) => {
    setCategoriesAnchor(event.currentTarget);
  };

  const handleCategoriesClose = () => {
    setCategoriesAnchor(null);
  };

  const navItems = [
    {
      text: "Home",
      icon: <HomeRoundedIcon sx={{ color: "#ff6923" }} />,
      path: "/",
    },
    {
      text: "Feedback",
      icon: <FavoriteRoundedIcon sx={{ color: "#e91e63" }} />,
      path: "/feedback",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Seção Esquerda */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Menu Mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuOpenRoundedIcon />
            </IconButton>

            {/* Logo - Desktop Only */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                mr: 3,
                ml: { xs: 1, md: 8 },
                p: 2,
                textDecoration: "none",
              }}
            >
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  height: "60px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Menu Desktop */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <IconButton
                component={RouterLink}
                to="/"
                sx={{
                  color: "white",
                  mr: 2,
                  "&:hover": { color: "#ff6923" },
                }}
              >
                <HomeRoundedIcon />
              </IconButton>

              <Button
                onClick={handleCategoriesOpen}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: "white",
                  ml: 1,
                  "&:hover": {
                    color: "#ff6923",
                  },
                }}
              >
                Categorias
              </Button>

              <Button
                component={RouterLink}
                to="/feedback"
                startIcon={<FavoriteRoundedIcon />}
                sx={{
                  color: "white",
                  ml: 1,
                  "&:hover": {
                    color: "#ff6923",
                  },
                }}
              >
                Feedback
              </Button>
            </Box>
          </Box>

          {/* Seção Central */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Categorias - Mobile */}
          <Button
            onClick={handleCategoriesOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              display: { xs: "flex", md: "none" },
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Categorias
          </Button>

          {/* Seção Direita - Apenas Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Redes Sociais - Desktop */}
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <IconButton
                href="https://www.instagram.com/accounts/login/?next=%2Fclosettmodafitness_%2F&source=omni_redirect"
                target="_blank"
                sx={{
                  color: "white",
                  "&:hover": { color: "#E4405F" },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                sx={{
                  color: "white",
                  "&:hover": { color: "#1877F2" },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://wa.me/5585991893149"
                target="_blank"
                sx={{
                  color: "white",
                  "&:hover": { color: "#25D366" },
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>

            {/* Carrinho e Menu Usuário - Desktop */}
            <IconButton
              component={RouterLink}
              to="/cart"
              sx={{ color: "white" }}
            >
              <Badge badgeContent={itemCount} color="error">
                <ShoppingCartRoundedIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenu} sx={{ color: "white" }}>
                  <PersonRoundedIcon />
                </IconButton>
                <Menu
                  id={menuId}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      bgcolor: "black",
                      color: "white",
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleProfile}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                    }}
                  >
                    Perfil
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/admin");
                      }}
                      sx={{
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      Painel Admin
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                    }}
                  >
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<LoginRoundedIcon />}
                sx={{
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Entrar
              </Button>
            )}
          </Box>
        </Toolbar>

        {/* Menu de Categorias - Desktop */}
        <Menu
          anchorEl={categoriesAnchor}
          open={Boolean(categoriesAnchor)}
          onClose={handleCategoriesClose}
          PaperProps={{
            sx: {
              mt: 1,
              bgcolor: "black",
              color: "white",
              width: 280,
              maxHeight: "70vh",
              overflowY: "auto",
              "& .MuiListItem-root": {
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              },
              "& .MuiListItemIcon-root": {
                color: "white",
              },
              "& .MuiListItemButton-root:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            },
          }}
          transformOrigin={{ horizontal: "left", vertical: "top" }}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <CategoryGrid onCategoryClick={handleCategoriesClose} />
        </Menu>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "black",
            color: "white",
          },
        }}
      >
        <Box
          sx={{
            width: 280,
            pt: 2,
            color: "white",
          }}
          role="presentation"
        >
          {/* Logo Section */}
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <img
              src={logoImage}
              alt="Logo"
              style={{
                height: "40px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }} />

          {/* Profile Section */}
          <Box sx={{ p: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
                  Olá, {isAdmin ? "Admin" : "Usuário"}
                </Typography>
                <Button
                  component={RouterLink}
                  to="/profile"
                  fullWidth
                  sx={{
                    color: "white",
                    justifyContent: "flex-start",
                    mb: 1,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  startIcon={<PersonRoundedIcon />}
                  onClick={() => setMobileOpen(false)}
                >
                  Perfil
                </Button>
                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    fullWidth
                    sx={{
                      color: "#ff6923",
                      justifyContent: "flex-start",
                      mb: 1,
                      "&:hover": {
                        bgcolor: "rgba(255, 105, 35, 0.1)",
                      },
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Painel Admin
                  </Button>
                )}
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  fullWidth
                  sx={{
                    color: "white",
                    justifyContent: "flex-start",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  startIcon={<LoginRoundedIcon />}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<LoginRoundedIcon />}
                fullWidth
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "#ff6923",
                    color: "#ff6923",
                  },
                }}
                variant="outlined"
                onClick={() => setMobileOpen(false)}
              >
                Entrar
              </Button>
            )}
          </Box>

          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }} />

          {/* Carrinho */}
          <Box sx={{ p: 2 }}>
            <Button
              component={RouterLink}
              to="/cart"
              startIcon={
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCartRoundedIcon />
                </Badge>
              }
              fullWidth
              sx={{
                color: "white",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => setMobileOpen(false)}
            >
              Carrinho
            </Button>
          </Box>

          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }} />

          {/* Navigation Items */}
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Redes Sociais - Mobile */}
          <Box sx={{ p: 2, display: "flex", justifyContent: "center", gap: 2 }}>
            <IconButton
              href="https://www.instagram.com/accounts/login/?next=%2Fclosettmodafitness_%2F&source=omni_redirect"
              target="_blank"
              sx={{ color: "#E4405F" }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              sx={{ color: "#1877F2" }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://wa.me/5585991893149"
              target="_blank"
              sx={{ color: "#25D366" }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ResponsiveNavbar;
