import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { ASSETS_BASE_URL } from "../config";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [showError, setShowError] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    const quantityNum = parseInt(newQuantity, 10);
    if (!Number.isNaN(quantityNum) && quantityNum >= 0) {
      const success = updateQuantity(item.cartItemId, quantityNum);
      if (!success) {
        setShowError(true);
      }
    }
  };

  const stockQuantity =
    item.stock_quantity ?? item.stockQuantity ?? item.stock ?? 0;

  return (
    <>
      <ListItem
        divider
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: { xs: 1, sm: 0 },
          py: 2,
        }}
      >
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            src={
              item.main_image?.startsWith("http")
                ? item.main_image
                : item.main_image
                ? `${ASSETS_BASE_URL}/${item.main_image}`
                : "https://via.placeholder.com/80x80?text=Img"
            }
            sx={{ width: 80, height: 80, borderRadius: 2 }}
            imgProps={{
              style: { objectFit: "cover" },
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80x80?text=Img";
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {item.name}
            </Typography>
          }
          secondary={
            <>
              <Typography variant="body2" color="text.secondary">
                Cor: {item.selectedColor}, Tamanho: {item.selectedSize}
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="medium">
                {formatCurrency
                  ? formatCurrency(parseFloat(item.price))
                  : `R$ ${item.price}`}{" "}
                (Unid.)
              </Typography>
              {item.quantity >= stockQuantity && (
                <Typography variant="caption" color="error">
                  Limite de estoque atingido
                </Typography>
              )}
            </>
          }
          sx={{ flexGrow: 1, mb: { xs: 1, sm: 0 } }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            my: { xs: 1, sm: 0 },
            minWidth: "130px",
          }}
        >
          <Tooltip
            title={item.quantity <= 1 ? "Remover item" : "Diminuir quantidade"}
          >
            <span>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label="diminuir quantidade"
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Typography
            variant="body1"
            sx={{ mx: 1.5, width: "2em", textAlign: "center" }}
          >
            {item.quantity}
          </Typography>
          <Tooltip
            title={
              item.quantity >= stockQuantity
                ? "Estoque indisponível"
                : "Aumentar quantidade"
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= stockQuantity}
                aria-label="aumentar quantidade"
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            width: { xs: "auto", sm: "120px" },
            textAlign: { xs: "left", sm: "right" },
            my: { xs: 1, sm: 0 },
          }}
        >
          {formatCurrency
            ? formatCurrency(parseFloat(item.price) * item.quantity)
            : `R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
        </Typography>
        <Tooltip title="Remover item">
          <IconButton
            edge="end"
            aria-label="remover"
            onClick={() => removeFromCart(item.cartItemId)}
            sx={{ ml: { xs: 0, sm: 2 } }}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItem>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          variant="filled"
        >
          Quantidade excede o estoque disponível
        </Alert>
      </Snackbar>
    </>
  );
};

export default CartItem;
