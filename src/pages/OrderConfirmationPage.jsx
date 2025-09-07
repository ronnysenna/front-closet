import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getOrderById } from "../utils/api";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Erro ao buscar dados do pedido:", err);
        setError(
          "Não foi possível carregar os dados do pedido. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      intervalId = setInterval(fetchOrder, 30000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatPrice = (price) => {
    return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Em processamento":
        return "warning";
      case "Pago":
        return "success";
      case "Em entrega":
        return "info";
      case "Entregue":
        return "primary";
      case "Cancelado":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: "center", py: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Carregando detalhes do seu pedido...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Voltar para a loja
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, py: 4 }}>
        <Alert severity="warning">Pedido não encontrado</Alert>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          sx={{ mt: 3 }}
        >
          Voltar para a loja
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 3, md: 5 }, mb: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 64, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Pedido Confirmado!
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            Obrigado por comprar conosco.
          </Typography>
        </Box>

        <Card sx={{ mb: 4, bgcolor: "success.50" }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Pedido #{order.orderNumber || order.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {formatDate(order.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ fontWeight: "medium" }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              <ReceiptLongIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Detalhes do Pedido
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Itens
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {order.items.map((item) => (
                <Box key={item.id} sx={{ py: 1 }}>
                  <Grid container>
                    <Grid item xs={7}>
                      <Typography variant="body2">{item.name}</Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      <Typography variant="body2">{item.quantity}x</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs={8}>
                  <Typography variant="body2">Subtotal:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    {formatPrice(
                      order.items.reduce(
                        (sum, item) => sum + Number(item.price) * item.quantity,
                        0
                      )
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">Frete:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    {formatPrice(order.shippingCost)}
                  </Typography>
                </Grid>
                <Grid item xs={8} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Total:</Typography>
                </Grid>
                <Grid item xs={4} sx={{ mt: 1, textAlign: "right" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {formatPrice(order.total)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>
              <ShoppingBagIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Informações de Entrega
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Endereço de Entrega
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {order.shippingAddress}
              </Typography>

              <Typography variant="subtitle2" gutterBottom>
                Método de Envio
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {order.shippingMethod}
              </Typography>

              {order.trackingNumber && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    Código de Rastreamento
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {order.trackingNumber}
                  </Typography>
                </>
              )}
            </Paper>

            <Typography variant="h6" gutterBottom>
              Pagamento
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Método de Pagamento
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {order.paymentMethod}
              </Typography>

              {order.paymentId && (
                <>
                  <Typography variant="subtitle2" gutterBottom>
                    ID da Transação
                  </Typography>
                  <Typography variant="body2">{order.paymentId}</Typography>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={RouterLink}
              to="/my-orders"
              variant="outlined"
              color="primary"
            >
              Meus Pedidos
            </Button>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              color="primary"
            >
              Continuar Comprando
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmationPage;
