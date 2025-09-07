// src/pages/CartPage.jsx

import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import StorefrontIcon from "@mui/icons-material/Storefront"; // Ícone para ver produtos
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  Paper,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect, useId } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import couponsData from "../data/coupons.json";
import { formatCurrency } from "../utils/formatCurrency";
import { createOrder } from "../utils/api";

const CartPage = () => {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showMinOrderWarning, setShowMinOrderWarning] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false); // Estado para controlar diálogo de autenticação
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // IDs únicos para elementos de acessibilidade
  const authDialogTitleId = useId();
  const authDialogDescriptionId = useId();
  
  // Calcula total de atacado e varejo
  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalRetail = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.retailPrice
        ? parseFloat(item.retailPrice)
        : parseFloat(item.price)) *
        item.quantity,
    0
  );
  const totalWholesale = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  // O total exibido depende da quantidade
  const isWholesale = totalUnits >= 10;
  const total = isWholesale ? totalWholesale : totalRetail;
  const whatsappNumber = "5585991893149"; // IMPORTANTE: Coloque seu número

  // Usamos navigate para redirecionar
  const navigate = useNavigate();

  const getTotalUnits = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    if (getTotalUnits() < 10) {
      setShowMinOrderWarning(true);
      return;
    }
    sendWhatsAppOrder();
  };

  const sendWhatsAppOrder = () => {
    let message =
      "Olá Closet Moda Fitness! Gostaria de fazer o pedido dos seguintes itens:\n\n";
    cartItems.forEach((item) => {
      message += `*${item.name}*\n`;
      message += `  Cor: ${item.selectedColor}, Tamanho: ${item.selectedSize}\n`;
      message += `  Qtd: ${item.quantity} x ${
        isWholesale
          ? formatCurrency(parseFloat(item.price))
          : formatCurrency(
              item.retailPrice
                ? parseFloat(item.retailPrice)
                : parseFloat(item.price)
            )
      }\n`;
      message += `  Subtotal: ${
        isWholesale
          ? formatCurrency(parseFloat(item.price) * item.quantity)
          : formatCurrency(
              (item.retailPrice
                ? parseFloat(item.retailPrice)
                : parseFloat(item.price)) * item.quantity
            )
      }\n\n`;
    });
    message += `*Total do Pedido: ${
      formatCurrency ? formatCurrency(total) : `R$ ${total.toFixed(2)}`
    }*`;
    message += `\nTipo de cobrança: ${
      isWholesale ? "Atacado" : "Varejo"
    } (Pedido com ${totalUnits} peça${totalUnits > 1 ? "s" : ""})`;
    if (couponApplied && coupon) {
      message += `\nCupom aplicado: ${coupon.trim().toUpperCase()}`;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) return;

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
      // Mostra diálogo de autenticação em vez de redirecionar diretamente
      setShowAuthDialog(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        sku: item.sku,
      }));
      const orderData = {
        total,
        paymentMethod: "A combinar no WhatsApp",
        shippingAddress: "A combinar no WhatsApp",
        shippingMethod: "A combinar no WhatsApp",
        shippingCost: 0,
        items: orderItems,
      };

      console.log("Enviando pedido:", orderData);
      const response = await createOrder(orderData);
      console.log("Resposta do pedido:", response);

      // Garantir que todos os dados necessários estão presentes antes de atualizar o estado
      if (response && (response.orderId || response.id)) {
        const orderInfo = {
          ...response,
          items: cartItems.map((item) => ({ ...item })), // Clonando os itens para evitar problemas de referência
          total: total,
        };
        clearCart();
        // Redirecionar para a página de sucesso do pedido em vez de armazenar no estado
        navigate("/order-success", { state: { orderDetails: orderInfo } });
      } else {
        throw new Error("Resposta incompleta do servidor");
      }
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setError("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para navegar para registro/login
  const handleNavigateToAuth = (path) => {
    setShowAuthDialog(false);
    navigate(path, { state: { fromCart: true } });
  };

  // Aplica desconto se houver cupom válido
  const discountedTotal = total - discountValue;

  const handleApplyCoupon = () => {
    const found = couponsData.find(
      (c) => c.code.toUpperCase() === coupon.trim().toUpperCase()
    );
    if (found) {
      setDiscountValue(found.discount);
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Cupom inválido ou expirado.");
      setCouponApplied(false);
      setDiscountValue(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
        <RemoveShoppingCartIcon
          sx={{ fontSize: 80, color: "text.disabled", mb: 3 }}
        />
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "medium" }}
        >
          Seu carrinho está vazio!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Parece que você ainda não adicionou nenhum produto. Que tal dar uma
          olhada nas nossas novidades?
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
      {error && (
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "error.light",
              color: "error.dark",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1">{error}</Typography>
            <Button
              variant="text"
              color="error"
              onClick={() => setError(null)}
              sx={{ ml: 2 }}
            >
              Fechar
            </Button>
          </Paper>
        </Box>
      )}

      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Seu Carrinho de Compras
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <List>
          {cartItems.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 3 }}>
          {/* Campo para cupom de desconto */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Digite o código do cupom"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: "1rem",
                }}
                disabled={couponApplied}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApplyCoupon}
                disabled={couponApplied}
                sx={{ py: 1, fontWeight: "bold", width: "100%" }}
              >
                {couponApplied ? "Cupom Aplicado" : "Aplicar Cupom"}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {couponError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {couponError}
                </Typography>
              )}
              {couponApplied && (
                <Typography color="success.main" sx={{ mt: 1 }}>
                  Cupom aplicado! Desconto de R$ {discountValue.toFixed(2)}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Grid item>
              <Typography
                variant="h5"
                component="p"
                sx={{ fontWeight: "medium" }}
              >
                Total do Pedido:
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                component="p"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {formatCurrency
                  ? formatCurrency(discountedTotal)
                  : `R$ ${discountedTotal.toFixed(2)}`}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                <b>Varejo:</b> {formatCurrency(totalRetail)} | <b>Atacado:</b>{" "}
                {formatCurrency(totalWholesale)}
              </Typography>
              <Typography
                variant="body2"
                color={isWholesale ? "success.main" : "primary.main"}
                sx={{ mt: 0.5 }}
              >
                {isWholesale
                  ? "Cobrança no valor de atacado (10 peças ou mais)"
                  : "Cobrança no valor de varejo (menos de 10 peças)"}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            justifyContent={{ xs: "center", sm: "flex-end" }}
          >
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
                onClick={handleFinishOrder}
                startIcon={<ShoppingCartCheckoutIcon />}
                sx={{ py: 1.2, fontWeight: "bold" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Finalizar Pedido"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Modal/Aviso para pedidos abaixo de 10 peças */}
      {showMinOrderWarning && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{ p: 4, maxWidth: 350, textAlign: "center" }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Atenção!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Pedidos abaixo de <b>10 peças</b> serão cobrados no valor de{" "}
              <b>varejo</b>.
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
                  sx={{ py: 1.2, fontWeight: "bold" }}
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
                  sx={{ py: 1.2, fontWeight: "bold" }}
                >
                  Continuar Comprando
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Diálogo de autenticação para checkout */}
      <Dialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        aria-labelledby={authDialogTitleId}
        aria-describedby={authDialogDescriptionId}
      >
        <DialogTitle id={authDialogTitleId}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Autenticação Necessária
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id={authDialogDescriptionId} sx={{ mb: 2 }}>
            Para finalizar sua compra, você precisa estar logado na sua conta.
            Escolha uma das opções abaixo:
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => handleNavigateToAuth("/login")}
                sx={{ py: 1.5, mb: 1 }}
              >
                Já tenho uma conta
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => handleNavigateToAuth("/register")}
                sx={{ py: 1.5 }}
              >
                Criar uma nova conta
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowAuthDialog(false)}
            color="inherit"
            sx={{ fontWeight: "medium" }}
          >
            Continuar comprando
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
