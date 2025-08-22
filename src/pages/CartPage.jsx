// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  Divider,
  Grid,
} from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Ícone para ver produtos

const CartPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [showMinOrderWarning, setShowMinOrderWarning] = useState(false);
  const total = getCartTotal();
  const whatsappNumber = "5585997173941"; // IMPORTANTE: Coloque seu número

  const getTotalUnits = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    if (getTotalUnits() < 10) {
      setShowMinOrderWarning(true);
      return;
    }
    sendWhatsAppOrder();
  };

  const sendWhatsAppOrder = () => {
    let message = "Olá Gofashion! Gostaria de fazer o pedido dos seguintes itens:\n\n";
    cartItems.forEach(item => {
      message += `*${item.title}*\n`;
      message += `  Cor: ${item.selectedColor}, Tamanho: ${item.selectedSize}\n`;
      message += `  Qtd: ${item.quantity} x ${formatCurrency ? formatCurrency(parseFloat(item.price)) : `R$ ${item.price}`}\n`;
      message += `  Subtotal: ${formatCurrency ? formatCurrency(parseFloat(item.price) * item.quantity) : `R$ ${(parseFloat(item.price) * item.quantity).toFixed(2)}`}\n\n`;
    });
    message += `*Total do Pedido: ${formatCurrency ? formatCurrency(total) : `R$ ${total.toFixed(2)}`}*`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <RemoveShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Seu carrinho está vazio!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Parece que você ainda não adicionou nenhum produto. Que tal dar uma olhada nas nossas novidades?
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/"
          size="large"
          startIcon={<StorefrontIcon />}
        >
          Ver Produtos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Seu Carrinho de Compras
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <List>
          {cartItems.map(item => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 3 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Typography variant="h5" component="p" sx={{ fontWeight: 'medium' }}>
                Total do Pedido:
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" component="p" color="primary" sx={{ fontWeight: 'bold' }}>
                {formatCurrency ? formatCurrency(total) : `R$ ${total.toFixed(2)}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
            <Grid item xs={12} sm="auto">
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={clearCart}
                startIcon={<RemoveShoppingCartIcon />}
                sx={{ py: 1.2 }}
              >
                Limpar Carrinho
              </Button>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleWhatsAppCheckout}
                startIcon={<WhatsAppIcon />}
                endIcon={<ShoppingCartCheckoutIcon />}
                sx={{ py: 1.2, fontWeight: 'bold' }}
              >
                Finalizar via WhatsApp
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Modal/Aviso para pedidos abaixo de 10 peças */}
      {showMinOrderWarning && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'rgba(0,0,0,0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Paper elevation={6} sx={{ p: 4, maxWidth: 350, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Atenção!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Pedidos abaixo de <b>10 peças</b> serão cobrados no valor de <b>varejo</b>.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => {
                    setShowMinOrderWarning(false);
                    sendWhatsAppOrder();
                  }}
                  sx={{ py: 1.2, fontWeight: 'bold' }}
                >
                  Finalizar Pedido
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowMinOrderWarning(false)}
                  sx={{ py: 1.2, fontWeight: 'bold' }}
                >
                  Continuar Comprando
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;