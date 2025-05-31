// src/components/CartItem.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Box,
  Typography,
  IconButton,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField, // Para uma entrada de quantidade mais estilizada
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    const quantityNum = parseInt(newQuantity, 10);
    if (!isNaN(quantityNum) && quantityNum >= 0) { // Permite 0 para remover via updateQuantity
        if (quantityNum > item.stock) {
            updateQuantity(item.cartItemId, item.stock);
        } else {
            updateQuantity(item.cartItemId, quantityNum);
        }
    }
  };


  return (
    <ListItem
      divider
      sx={{
        py: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <ListItemAvatar sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}>
        <Avatar
          src={item.imageUrl}
          alt={item.title}
          variant="rounded"
          sx={{ width: 80, height: 80 }}
          onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=Img'}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            {item.title}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary">
              Cor: {item.selectedColor}, Tamanho: {item.selectedSize}
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="medium">
              {formatCurrency ? formatCurrency(parseFloat(item.price)) : `R$ ${item.price}`} (Unid.)
            </Typography>
          </>
        }
        sx={{ flexGrow: 1, mb: { xs: 1, sm: 0 } }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', my: { xs: 1, sm: 0 }, minWidth: '130px' }}>
        <Tooltip title="Diminuir quantidade">
          <span> {/* Span para habilitar tooltip em botão desabilitado */}
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="diminuir quantidade"
            >
              <RemoveIcon fontSize="small"/>
            </IconButton>
          </span>
        </Tooltip>
        <Typography variant="body1" sx={{ mx: 1.5, width: '2em', textAlign: 'center' }}>
          {item.quantity}
        </Typography>
        <Tooltip title="Aumentar quantidade">
          <span>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              aria-label="aumentar quantidade"
            >
              <AddIcon fontSize="small"/>
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ width: { xs: 'auto', sm: '120px' }, textAlign: {xs: 'left', sm: 'right'}, my: { xs: 1, sm: 0 } }}>
        {formatCurrency ? formatCurrency(parseFloat(item.price) * item.quantity) : `R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)}`}
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
  );
};

export default CartItem;