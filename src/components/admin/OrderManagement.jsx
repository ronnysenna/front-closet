import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import {
  updateOrderNotes,
  updateOrderPaymentMethod,
  updateOrderTracking,
} from "../../utils/api";

const OrderManagement = ({ order, onUpdate }) => {
  // Estados para os diferentes modais
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openTrackingDialog, setOpenTrackingDialog] = useState(false);

  // Estados para os dados
  const [notes, setNotes] = useState(order?.notes || "");
  const [paymentMethod, setPaymentMethod] = useState(
    order?.paymentMethod || ""
  );
  const [paymentId, setPaymentId] = useState(order?.paymentId || "");
  const [trackingNumber, setTrackingNumber] = useState(
    order?.trackingNumber || ""
  );

  // Métodos de pagamento válidos
  const validPaymentMethods = [
    "PIX",
    "Cartão de Crédito",
    "Boleto",
    "Transferência",
    "Dinheiro",
  ];

  // Handlers para abrir/fechar diálogos
  const handleOpenNotesDialog = () => {
    setNotes(order?.notes || "");
    setOpenNotesDialog(true);
  };

  const handleCloseNotesDialog = () => {
    setOpenNotesDialog(false);
  };

  const handleOpenPaymentDialog = () => {
    setPaymentMethod(order?.paymentMethod || "");
    setPaymentId(order?.paymentId || "");
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };

  const handleOpenTrackingDialog = () => {
    setTrackingNumber(order?.trackingNumber || "");
    setOpenTrackingDialog(true);
  };

  const handleCloseTrackingDialog = () => {
    setOpenTrackingDialog(false);
  };

  // Handlers para atualizar dados
  const handleUpdateNotes = async () => {
    try {
      await updateOrderNotes(order.id, notes);
      handleCloseNotesDialog();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar observações:", error);
      alert("Erro ao atualizar observações. Tente novamente.");
    }
  };

  const handleUpdatePayment = async () => {
    try {
      await updateOrderPaymentMethod(order.id, {
        paymentMethod,
        paymentId: paymentId || undefined,
      });
      handleClosePaymentDialog();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar método de pagamento:", error);
      alert("Erro ao atualizar método de pagamento. Tente novamente.");
    }
  };

  const handleUpdateTracking = async () => {
    try {
      await updateOrderTracking(order.id, trackingNumber);
      handleCloseTrackingDialog();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar rastreamento:", error);
      alert("Erro ao atualizar número de rastreamento. Tente novamente.");
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={1}>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={handleOpenNotesDialog}
          >
            Observações
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={handleOpenPaymentDialog}
          >
            Pagamento
          </Button>
        </Grid>
        <Grid item>
          <Button
            size="small"
            variant="outlined"
            onClick={handleOpenTrackingDialog}
          >
            Rastreamento
          </Button>
        </Grid>
      </Grid>

      {/* Diálogo para Observações */}
      <Dialog open={openNotesDialog} onClose={handleCloseNotesDialog} fullWidth>
        <DialogTitle>Observações do Pedido #{order?.id}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Observações"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione observações sobre este pedido..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotesDialog}>Cancelar</Button>
          <Button onClick={handleUpdateNotes} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Método de Pagamento */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        fullWidth
      >
        <DialogTitle>Pagamento do Pedido #{order?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Método de Pagamento</InputLabel>
            <Select
              value={paymentMethod}
              label="Método de Pagamento"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {validPaymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="ID do Pagamento"
            fullWidth
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Número da transação, comprovante, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cancelar</Button>
          <Button onClick={handleUpdatePayment} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Número de Rastreamento */}
      <Dialog
        open={openTrackingDialog}
        onClose={handleCloseTrackingDialog}
        fullWidth
      >
        <DialogTitle>Rastreamento do Pedido #{order?.id}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Número de Rastreamento"
            fullWidth
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Informe o código de rastreamento..."
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Informe o código de rastreamento fornecido pela transportadora.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTrackingDialog}>Cancelar</Button>
          <Button onClick={handleUpdateTracking} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
