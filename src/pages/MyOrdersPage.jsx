import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMyOrders, cancelOrder } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import CancelIcon from "@mui/icons-material/Cancel";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    let intervalId;
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
        setError(
          "Não foi possível carregar seus pedidos. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
    intervalId = setInterval(fetchMyOrders, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const handleOpenDetailsDialog = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
  };

  const handleOpenCancelDialog = (orderId) => {
    setCancelingOrderId(orderId);
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setCancelingOrderId(null);
  };

  const handleCancelOrder = async () => {
    if (!cancelingOrderId) return;

    try {
      setCancelLoading(true);
      await cancelOrder(cancelingOrderId);

      // Atualizar a lista de pedidos
      const updatedOrders = await getMyOrders();
      setOrders(updatedOrders);

      handleCloseCancelDialog();
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      setError(
        "Não foi possível cancelar o pedido. Por favor, tente novamente."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const canCancel = (orderStatus) => {
    return ["Em processamento", "Pago"].includes(orderStatus);
  };

  const getStatusChipColor = (status) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatPrice = (price) => {
    return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ my: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ my: 4, textAlign: "center" }}>
        <Card>
          <CardContent sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Você ainda não fez nenhum pedido
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Quando você fizer um pedido, ele aparecerá aqui.
            </Typography>
            <Button variant="contained" color="primary" href="/">
              Ir para a loja
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meus Pedidos
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Pedido #
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {order.orderNumber || order.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Data
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusChipColor(order.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="textSecondary">
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatPrice(order.total)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {canCancel(order.status) && (
                          <Tooltip title="Cancelar pedido">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenCancelDialog(order.id)}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Button
                        onClick={() => handleOpenDetailsDialog(order)}
                        variant="outlined"
                        size="small"
                      >
                        Ver Detalhes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo de Detalhes do Pedido */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        fullWidth
        maxWidth="md"
      >
        {selectedOrder && (
          <>
            <DialogTitle>Detalhes do Pedido #{selectedOrder.id}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informações do Pedido
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Data do Pedido:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatDate(selectedOrder.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Status:
                      </Typography>
                      <Chip
                        label={selectedOrder.status}
                        color={getStatusChipColor(selectedOrder.status)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Método de Pagamento:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.paymentMethod}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        ID do Pagamento:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.paymentId || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Endereço de Entrega:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.shippingAddress}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Método de Envio:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.shippingMethod}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Custo de Envio:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatPrice(selectedOrder.shippingCost)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Itens do Pedido
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell align="right">Preço</TableCell>
                        <TableCell align="right">Qtd</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">
                            {formatPrice(item.price)}
                          </TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">
                            {formatPrice(Number(item.price) * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle2">Subtotal:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(
                            selectedOrder.items.reduce(
                              (sum, item) =>
                                sum + Number(item.price) * item.quantity,
                              0
                            )
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle2">Frete:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatPrice(selectedOrder.shippingCost)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} />
                        <TableCell align="right">
                          <Typography variant="subtitle1">Total:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {formatPrice(selectedOrder.total)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo de confirmação de cancelamento */}
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancelar pedido</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja cancelar este pedido? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Não, manter pedido</Button>
          <Button
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            disabled={cancelLoading}
          >
            {cancelLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Sim, cancelar pedido"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyOrdersPage;
