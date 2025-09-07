import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
  TablePagination,
  IconButton,
  Tooltip,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  getOrders,
  updateOrderStatus,
  getOrderByNumber,
} from "../../utils/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrderManagement from "../../components/admin/OrderManagement";

const AdminOrdersPage = ({ onSuccess }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openTrackingDialog, setOpenTrackingDialog] = useState(false);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterTab, setFilterTab] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setError(
        "Não foi possível carregar os pedidos. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000); // Atualização a cada 30 segundos
    return () => clearInterval(intervalId);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setPaymentId(order.paymentId || "");
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
  };

  const handleOpenDetailsDialog = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handlePaymentIdChange = (event) => {
    setPaymentId(event.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        paymentId: paymentId || undefined,
      });

      // Atualizar a lista de pedidos
      await fetchOrders();

      // Notificar sucesso
      if (onSuccess) onSuccess("Status do pedido atualizado com sucesso");

      handleCloseStatusDialog();
    } catch (err) {
      console.error("Erro ao atualizar status do pedido:", err);
      setError("Não foi possível atualizar o status do pedido.");
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Em processamento":
        return "warning";
      case "Pago":
        return "success";
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
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="contained"
          onClick={fetchOrders}
          sx={{ mt: 2 }}
          startIcon={<RefreshIcon />}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  // Funções para abrir/fechar diálogos
  const handleOpenNotesDialog = (order) => {
    setSelectedOrder(order);
    setOrderNotes(order.notes || "");
    setOpenNotesDialog(true);
  };

  const handleCloseNotesDialog = () => {
    setOpenNotesDialog(false);
  };

  const handleOpenPaymentDialog = (order) => {
    setSelectedOrder(order);
    setNewPaymentMethod(order.paymentMethod);
    setPaymentId(order.paymentId || "");
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleOpenTrackingDialog = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setOpenTrackingDialog(true);
  };

  const handleCloseTrackingDialog = () => {
    setOpenTrackingDialog(false);
  };

  const handleOpenSearchDialog = () => {
    setOpenSearchDialog(true);
    setSearchOrderNumber("");
  };

  const handleCloseSearchDialog = () => {
    setOpenSearchDialog(false);
  };

  // Funções para atualizar dados do pedido
  const handleUpdateNotes = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderNotes(selectedOrder.id, orderNotes);
      await fetchOrders();
      handleCloseNotesDialog();
    } catch (err) {
      console.error("Erro ao atualizar observações:", err);
      setError("Não foi possível atualizar as observações do pedido.");
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderPaymentMethod(selectedOrder.id, {
        paymentMethod: newPaymentMethod,
        paymentId: paymentId || undefined,
      });
      await fetchOrders();
      handleClosePaymentDialog();
    } catch (err) {
      console.error("Erro ao atualizar método de pagamento:", err);
      setError("Não foi possível atualizar o método de pagamento.");
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;

    try {
      await updateOrderTracking(selectedOrder.id, trackingNumber);
      await fetchOrders();
      handleCloseTrackingDialog();
    } catch (err) {
      console.error("Erro ao atualizar número de rastreamento:", err);
      setError("Não foi possível atualizar o número de rastreamento.");
    }
  };

  const handleSearchOrder = async () => {
    if (!searchOrderNumber) return;

    try {
      setLoading(true);
      const order = await getOrderByNumber(searchOrderNumber);

      // Se encontrou o pedido, abre o diálogo de detalhes
      if (order) {
        setSelectedOrder(order);
        setOpenDetailsDialog(true);
        setOpenSearchDialog(false);
      }
    } catch (err) {
      console.error("Erro ao buscar pedido:", err);
      setError("Pedido não encontrado ou erro na busca.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newValue) => {
    setFilterTab(newValue);
    setPage(0); // Resetar página quando mudar o filtro
  };

  // Função para filtrar pedidos
  const getFilteredOrders = () => {
    if (!orders) return [];

    // Primeiro aplicamos o filtro por status
    let filteredByStatus;
    switch (filterTab) {
      case 0: // Todos
        filteredByStatus = orders;
        break;
      case 1: // Em processamento
        filteredByStatus = orders.filter(
          (order) => order.status === "Em processamento"
        );
        break;
      case 2: // Pagos
        filteredByStatus = orders.filter((order) => order.status === "Pago");
        break;
      case 3: // Cancelados
        filteredByStatus = orders.filter(
          (order) => order.status === "Cancelado"
        );
        break;
      default:
        filteredByStatus = orders;
    }

    // Se houver um termo de busca, aplicamos um filtro adicional
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim();
      return filteredByStatus.filter(
        (order) =>
          (order.orderNumber &&
            order.orderNumber.toLowerCase().includes(term)) ||
          (order.user?.name && order.user.name.toLowerCase().includes(term)) ||
          (order.user?.email &&
            order.user.email.toLowerCase().includes(term)) ||
          (order.shippingAddress &&
            order.shippingAddress.toLowerCase().includes(term))
      );
    }

    return filteredByStatus;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Gerenciar Pedidos
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Buscar pedido..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
          >
            Atualizar
          </Button>
        </Box>
      </Box>

      <Tabs
        value={filterTab}
        onChange={handleFilterChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Todos" />
        <Tab label="Em processamento" />
        <Tab label="Pagos" />
        <Tab label="Cancelados" />
      </Tabs>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 240px)" }}>
          <Table stickyHeader aria-label="tabela de pedidos">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredOrders()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user?.name || "-"}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell align="right">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusChipColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Ver detalhes">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDetailsDialog(order)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Alterar status">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenStatusDialog(order)}
                            sx={{ ml: 1 }}
                          >
                            Status
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 3 }}>
                      Nenhum pedido encontrado
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={getFilteredOrders().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Itens por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Paper>

      {/* Diálogo de Alterar Status */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Alterar Status do Pedido #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="Pago">Pago</MenuItem>
              <MenuItem value="Cancelado">Cancelado</MenuItem>
            </Select>
          </FormControl>

          {newStatus === "Pago" && (
            <TextField
              margin="normal"
              fullWidth
              label="ID do Pagamento (opcional)"
              value={paymentId}
              onChange={handlePaymentIdChange}
              placeholder="ID da transação PIX/Cartão"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancelar</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Detalhes do Pedido */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detalhes do Pedido #{selectedOrder?.id}</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informações do Pedido
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Cliente:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.user?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Email:
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedOrder.user?.email}
                      </Typography>
                    </Grid>
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
            </>
          )}
        </DialogContent>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Gerenciamento Avançado
          </Typography>
          <OrderManagement order={selectedOrder} onUpdate={fetchOrders} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Fechar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCloseDetailsDialog();
              handleOpenStatusDialog(selectedOrder);
            }}
          >
            Atualizar Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;
