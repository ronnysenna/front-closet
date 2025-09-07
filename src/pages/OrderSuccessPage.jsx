// src/pages/OrderSuccessPage.jsx
import React, { useEffect } from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { formatCurrency } from "../utils/formatCurrency";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderDetails } = location.state || {};

  const whatsappNumber = "5585991893149"; // Número da loja

  useEffect(() => {
    if (!orderDetails) {
      // Se não tiver detalhes do pedido, redireciona para a página inicial
      navigate("/");
      return;
    }

    // Redirecionar para a página inicial após 30 segundos
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 30000);

    // Limpar o timer se o componente for desmontado
    return () => clearTimeout(redirectTimer);
  }, [orderDetails, navigate]);

  const handleSendWhatsApp = () => {
    if (!orderDetails) return;

    let message = `Olá Closet Moda Fitness! Pedido criado no site:\n\n`;
    orderDetails.items.forEach((item) => {
      message += `*${item.name}*\n  Cor: ${
        item.selectedColor || "-"
      }, Tamanho: ${item.selectedSize || "-"}\n  Qtd: ${
        item.quantity
      } x ${formatCurrency(
        parseFloat(item.price)
      )}\n  Subtotal: ${formatCurrency(
        parseFloat(item.price) * item.quantity
      )}\n\n`;
    });

    message += `*Total do Pedido: ${formatCurrency(
      parseFloat(orderDetails.total)
    )}*`;
    message += `\nPedido: ${orderDetails.orderNumber || orderDetails.orderId}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (!orderDetails) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="text.secondary">
          Nenhum detalhe de pedido encontrado. Redirecionando...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid #4caf50",
          boxShadow: "0 4px 20px rgba(76, 175, 80, 0.15)",
        }}
      >
        <CheckCircleIcon
          color="success"
          sx={{
            fontSize: 80,
            mb: 2,
            animation: "bounce 1s ease-in-out infinite alternate",
            "@keyframes bounce": {
              "0%": { transform: "translateY(0)" },
              "100%": { transform: "translateY(-10px)" },
            },
          }}
        />

        <Box
          sx={{
            bgcolor: "success.light",
            py: 2,
            px: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "success.dark" }}
          >
            Pedido Realizado com Sucesso!
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, color: "success.dark" }}>
            Número do Pedido: #
            {orderDetails.orderNumber || orderDetails.orderId}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
          Agora é só clicar abaixo para enviar seu pedido para o WhatsApp e
          combinar os detalhes de pagamento e entrega.
        </Typography>

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          startIcon={<WhatsAppIcon />}
          onClick={handleSendWhatsApp}
          sx={{ fontWeight: "bold", py: 1.5, mb: 2 }}
        >
          Enviar para WhatsApp
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          component={RouterLink}
          to="/"
          startIcon={<StorefrontIcon />}
          sx={{ py: 1.5 }}
        >
          Voltar para a loja
        </Button>

        <Box sx={{ mt: 4, bgcolor: "grey.100", p: 2, borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Você será redirecionado para a página inicial automaticamente em 30
            segundos.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;
