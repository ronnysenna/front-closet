// src/components/ProductCard.jsx

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Chip,
  Zoom,
} from "@mui/material";
import { useId, useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { ASSETS_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { toggleFavoriteProduct } from "../utils/api";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Verifica se o produto está nos favoritos do usuário
  // (Ajuste conforme o backend retornar favoritos no perfil)
  useEffect(() => {
    if (user?.favorites) {
      setIsFavorite(user.favorites.includes(product.id));
    } else {
      setIsFavorite(false);
    }
  }, [user, product.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setFavoriteLoading(true);
    try {
      // Chama API para alternar favorito
      const response = await toggleFavoriteProduct(product.id);
      // Atualiza o usuário localmente com a lista de favoritos retornada pelo backend
      if (response && Array.isArray(response.favorites)) {
        setUser((prev) => ({ ...(prev || {}), favorites: response.favorites }));
        setIsFavorite(response.favorites.includes(product.id));
      } else {
        console.warn(
          "toggleFavoriteProduct retornou resposta inesperada:",
          response
        );
      }
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
      // opcional: mostrar uma notificação para o usuário
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Gerar IDs únicos para os componentes
  const sizeSelectId = useId();
  const colorSelectId = useId();

  // Define tamanhos e cores padrão
  const defaultSizes = ["P", "M", "G"];
  const defaultColors = ["Preto", "Branco", "Rosa"];

  // Usa as propriedades do produto se existirem, ou valores padrão
  const sizes = Array.isArray(product.sizes) ? product.sizes : defaultSizes;
  const colors = Array.isArray(product.colors) ? product.colors : defaultColors;

  const [selectedSize, setSelectedSize] = useState(
    sizes.length > 0 ? sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState(
    colors.length > 0 ? colors[0] : ""
  );
  const [added, setAdded] = useState(false);
  const [hover, setHover] = useState(false);

  // Estado para controlar os diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openOutOfStockDialog, setOpenOutOfStockDialog] = useState(false);

  // Verificar estoque
  const stockQuantity = product.stock_quantity ?? product.stockQuantity ?? 0;
  const isOutOfStock = stockQuantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      setOpenOutOfStockDialog(true);
      return;
    }

    addToCart(product, 1, selectedSize, selectedColor);
    setAdded(true);
    setOpenDialog(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Função para continuar comprando
  const handleContinueShopping = () => {
    setOpenDialog(false);
  };

  // Função para ir para o carrinho
  const handleGoToCart = () => {
    setOpenDialog(false);
    navigate("/cart");
  };

  // Verificar se o produto tem preço de varejo para mostrar como preço original
  const hasRetailPrice =
    product.retailPrice &&
    parseFloat(product.retailPrice) > parseFloat(product.price);

  // Função para obter o status do estoque
  const getStockStatus = () => {
    if (isOutOfStock) return null; // Não mostra mensagem pois já tem o chip ESGOTADO
    if (stockQuantity <= 5) {
      return {
        message: `Últimas ${stockQuantity} unidades`,
        color: "warning.main",
      };
    }
    if (stockQuantity <= 10) {
      return {
        message: `${stockQuantity} unidades em estoque`,
        color: "info.main",
      };
    }
    return {
      message: "Produto em estoque",
      color: "success.main",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: { xs: 420, sm: 440, md: 480 },
          maxWidth: { xs: "100%", md: 320 },
          mx: "auto",
          borderRadius: 3,
          boxShadow: hover
            ? "0 8px 24px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: hover ? "translateY(-8px)" : "none",
          overflow: "hidden",
          position: "relative",
          opacity: isOutOfStock ? 0.85 : 1,
          "&:hover": {
            "& .product-actions": {
              opacity: 1,
            },
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Faixa de desconto ou status de estoque */}
        {isOutOfStock ? (
          <Chip
            label="ESGOTADO"
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: "bold",
              zIndex: 2,
              px: 1,
              backgroundColor: "error.main",
              color: "white",
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        ) : (
          hasRetailPrice && (
            <Chip
              label={`-${Math.round(
                ((parseFloat(product.retailPrice) - parseFloat(product.price)) /
                  parseFloat(product.retailPrice)) *
                  100
              )}%`}
              color="error"
              size="small"
              icon={<LocalOfferIcon />}
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                fontWeight: "bold",
                zIndex: 2,
                px: 0.5,
              }}
            />
          )
        )}

        {/* Ações rápidas */}
        <Box
          className="product-actions"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 2,
          }}
        >
          <IconButton
            component={RouterLink}
            to={`/product/${product.id}`}
            aria-label="Ver detalhes"
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              ":hover": { bgcolor: "white", transform: "scale(1.1)" },
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>

          <IconButton
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              ":hover": { bgcolor: "white", transform: "scale(1.1)" },
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
            size="small"
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
          >
            {isFavorite ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" color="disabled" />
            )}
          </IconButton>
        </Box>

        {/* Imagem do produto */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="220"
            image={
              product.main_image?.startsWith("http")
                ? product.main_image
                : product.main_image
                ? `${ASSETS_BASE_URL}/${
                    product.main_image.startsWith("/")
                      ? product.main_image.substring(1)
                      : product.main_image
                  }`
                : "https://via.placeholder.com/400x400?text=Imagem+Indisponível"
            }
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x400?text=Imagem+Indisponível";
            }}
            sx={{
              objectFit: "cover",
              width: "100%",
              transition: "transform 0.5s ease",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
          />
        </Box>

        {/* Conteúdo do produto */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 220,
            pt: 2,
            px: 2.5,
          }}
        >
          <Box>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              noWrap
              title={product.name}
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "-0.2px",
              }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                minHeight: "40px",
                mb: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.description && product.description.length > 70
                ? `${product.description.substring(0, 70)}...`
                : product.description ||
                  product.short_description ||
                  "Sem descrição disponível"}
            </Typography>
          </Box>

          {/* Seletores de tamanho e cor */}
          <Box>
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel id={`size-label-${sizeSelectId}`}>Tamanho</InputLabel>
              <Select
                labelId={`size-label-${sizeSelectId}`}
                value={selectedSize}
                label="Tamanho"
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id={`color-label-${colorSelectId}`}>Cor</InputLabel>
              <Select
                labelId={`color-label-${colorSelectId}`}
                value={selectedColor}
                label="Cor"
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Preço e indicador de estoque */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency
                    ? formatCurrency(parseFloat(product.price))
                    : `R$ ${product.price}`}
                </Typography>

                {hasRetailPrice && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      mb: 0.5,
                    }}
                  >
                    {formatCurrency
                      ? formatCurrency(parseFloat(product.retailPrice))
                      : `R$ ${product.retailPrice}`}
                  </Typography>
                )}
              </Box>

              {/* Indicador de estoque */}
              {stockStatus && (
                <Typography
                  variant="caption"
                  sx={{
                    color: stockStatus.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                  {stockStatus.message}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>

        {/* Botões de ação */}
        <CardActions
          sx={{
            p: 2.5,
            pt: 0,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isOutOfStock && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 1, fontWeight: "medium", textAlign: "center" }}
            >
              Produto temporariamente indisponível
            </Typography>
          )}
          <Button
            fullWidth
            variant={isOutOfStock ? "outlined" : "contained"}
            color={added ? "success" : isOutOfStock ? "error" : "primary"}
            startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={isOutOfStock || added}
            sx={{
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              opacity: isOutOfStock ? 0.8 : 1,
              boxShadow: added
                ? "0 4px 12px rgba(76, 175, 80, 0.3)"
                : isOutOfStock
                ? "none"
                : "0 4px 12px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: isOutOfStock ? "none" : "translateY(-2px)",
                boxShadow: added
                  ? "0 6px 16px rgba(76, 175, 80, 0.4)"
                  : isOutOfStock
                  ? "none"
                  : "0 6px 16px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            {isOutOfStock
              ? "Produto Esgotado"
              : added
              ? "Adicionado!"
              : "Adicionar ao Carrinho"}
          </Button>
        </CardActions>
      </Card>

      {/* Diálogo de confirmação após adicionar ao carrinho */}
      <Dialog
        open={openDialog}
        onClose={handleContinueShopping}
        TransitionComponent={Zoom}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            p: 1,
            maxWidth: "xs",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CheckCircleIcon color="success" />
            Produto adicionado ao carrinho!
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <CardMedia
              component="img"
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                objectFit: "cover",
              }}
              image={
                product.main_image?.startsWith("http")
                  ? product.main_image
                  : product.main_image
                  ? `${ASSETS_BASE_URL}/${
                      product.main_image.startsWith("/")
                        ? product.main_image.substring(1)
                        : product.main_image
                    }`
                  : "https://via.placeholder.com/400x400?text=Imagem+Indisponível"
              }
              alt={product.name}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography variant="body2">
                Cor: {selectedColor}, Tamanho: {selectedSize}
              </Typography>
              <Typography
                variant="body2"
                color="primary"
                fontWeight="bold"
                mt={0.5}
              >
                {formatCurrency
                  ? formatCurrency(parseFloat(product.price))
                  : `R$ ${product.price}`}
              </Typography>
            </Box>
          </Box>
          <DialogContentText>O que você deseja fazer agora?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
          <Button
            variant="outlined"
            onClick={handleContinueShopping}
            sx={{ fontWeight: "medium", borderRadius: 2, px: 2 }}
          >
            Continuar Comprando
          </Button>
          <Button
            variant="contained"
            onClick={handleGoToCart}
            startIcon={<ShoppingCartIcon />}
            sx={{ fontWeight: "medium", borderRadius: 2, px: 2 }}
            autoFocus
          >
            Ver Carrinho
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de estoque zerado */}
      <Dialog
        open={openOutOfStockDialog}
        onClose={() => setOpenOutOfStockDialog(false)}
        TransitionComponent={Zoom}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            p: 2,
            maxWidth: "xs",
            textAlign: "center",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "error.main", pb: 1 }}>
          Produto Indisponível
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            Desculpe, mas este produto está temporariamente indisponível em
            nosso estoque. Volte em breve ou escolha outro produto de nossa
            coleção.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenOutOfStockDialog(false)}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
