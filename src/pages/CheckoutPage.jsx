import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { createOrder } from "../utils/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingMethod, setShippingMethod] = useState("PAC");
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  const steps = [
    "Endereço de entrega",
    "Método de envio",
    "Pagamento",
    "Revisão",
  ];

  // Calcular valores
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const calculateShippingCost = () => {
    // Lógica para cálculo de frete baseada no método selecionado
    switch (shippingMethod) {
      case "SEDEX":
        return 25.0;
      case "PAC":
        return 15.0;
      case "Jadlog":
        return 18.0;
      default:
        return 15.0;
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingCost();
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  const handleNext = () => {
    // Validar o formulário antes de avançar
    if (activeStep === 0 && !shippingAddress) {
      setError("Por favor, informe o endereço de entrega");
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
    setError(null);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      setError("Seu carrinho está vazio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar os itens do pedido
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        sku: item.sku,
      }));

      // Criar o pedido
      const orderData = {
        total: calculateTotal(),
        paymentMethod,
        shippingAddress,
        shippingMethod,
        shippingCost: calculateShippingCost(),
        items: orderItems,
      };

      const response = await createOrder(orderData);

      // Limpar o carrinho após o pedido ser criado com sucesso
      clearCart();

      // Redirecionar para a página de confirmação
      navigate(`/order-confirmation/${response.orderId}`);
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setError(
        "Não foi possível finalizar o pedido. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Renderizar o conteúdo baseado no passo atual
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Endereço
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="Endereço completo"
                fullWidth
                multiline
                rows={4}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
                error={error && !shippingAddress}
                helperText={
                  error && !shippingAddress ? "Endereço é obrigatório" : ""
                }
              />
            </Grid>
          </Grid>
        );

      case 1: // Método de envio
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
            >
              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="SEDEX"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">SEDEX</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Entrega expressa - 2 a 3 dias úteis
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        {formatPrice(25.0)}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="PAC"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">PAC</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Entrega econômica - 5 a 8 dias úteis
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        {formatPrice(15.0)}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="Jadlog"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">Jadlog</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Entrega padrão - 3 a 5 dias úteis
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ mt: 1 }}
                      >
                        {formatPrice(18.0)}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </FormControl>
        );

      case 2: // Pagamento
        return (
          <FormControl component="fieldset">
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="PIX"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">PIX</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamento instantâneo
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="Boleto"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">
                        Boleto Bancário
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamento em até 2 dias úteis
                      </Typography>
                    </Box>
                  }
                />
              </Paper>

              <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                <FormControlLabel
                  value="Cartão de Crédito"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle1">
                        Cartão de Crédito
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pagamento parcelado
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
          </FormControl>
        );

      case 3: // Revisão
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Detalhes da Entrega
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Endereço
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {shippingAddress}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Método de Envio
                </Typography>
                <Typography variant="body2">{shippingMethod}</Typography>
              </Paper>

              <Typography variant="h6" gutterBottom>
                Pagamento
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">{paymentMethod}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <List disablePadding>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.quantity}x ${formatPrice(
                          parseFloat(item.price)
                        )}`}
                      />
                      <Typography variant="body2">
                        {formatPrice(item.quantity * parseFloat(item.price))}
                      </Typography>
                    </ListItem>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body2">
                      {formatPrice(calculateSubtotal())}
                    </Typography>
                  </ListItem>

                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Frete" />
                    <Typography variant="body2">
                      {formatPrice(calculateShippingCost())}
                    </Typography>
                  </ListItem>

                  <ListItem sx={{ py: 2, px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1">Total</Typography>
                      }
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatPrice(calculateTotal())}
                    </Typography>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return "Passo desconhecido";
    }
  };

  // Verificar se o carrinho está vazio
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Adicione alguns produtos antes de finalizar a compra
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
          >
            Ver Produtos
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Finalizar Pedido
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Voltar
          </Button>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={
                activeStep === steps.length - 1 ? handleSubmitOrder : handleNext
              }
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                "Finalizar Pedido"
              ) : (
                "Próximo"
              )}
            </Button>
          </div>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
