import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PendingIcon from "@mui/icons-material/Pending";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

const FinancialMetrics = ({ stats, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return (
      <Typography color="text.secondary">
        Não foi possível carregar as métricas financeiras.
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Métricas Financeiras
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total de receita */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "primary.50" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Receita Total
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {formatCurrency(stats.totalRevenue || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total de vendas confirmadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Receita Recente */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "success.50" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <RecentActorsIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Receita Recente
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {formatCurrency(stats.recentRevenue || 0)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ArrowUpwardIcon
                  color="success"
                  fontSize="small"
                  sx={{ mr: 0.5 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Últimos 7 dias
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticket Médio */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "info.50" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ShoppingBagIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Ticket Médio
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {formatCurrency(stats.averageTicket || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats.paidOrdersCount || 0} pedidos pagos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Receita Potencial */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "warning.50" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PendingIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Receita Potencial
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {formatCurrency(stats.potentialRevenue || 0)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Pedidos em processamento
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Distribuição por método de pagamento */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Métodos de Pagamento
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.paymentMethods && stats.paymentMethods.length > 0 ? (
              <List dense>
                {stats.paymentMethods.map((method, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={method.method}
                      secondary={`${method.count} pedidos`}
                      sx={{ flex: "1", mr: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ minWidth: "80px", textAlign: "right" }}
                    >
                      {formatCurrency(method.total || 0)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Nenhum pagamento registrado ainda.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Status dos pedidos */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Status dos Pedidos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats.orderStatusStats ? (
              <List dense>
                <ListItem
                  secondaryAction={
                    <Typography variant="body2">
                      {stats.orderStatusStats.Emprocessamento || 0}
                    </Typography>
                  }
                >
                  <ListItemText primary="Em processamento" />
                </ListItem>
                <ListItem
                  secondaryAction={
                    <Typography variant="body2">
                      {stats.orderStatusStats.Pago || 0}
                    </Typography>
                  }
                >
                  <ListItemText primary="Pago" />
                </ListItem>
                <ListItem
                  secondaryAction={
                    <Typography variant="body2">
                      {stats.orderStatusStats.Cancelado || 0}
                    </Typography>
                  }
                >
                  <ListItemText primary="Cancelado" />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary" sx={{ py: 2 }}>
                Nenhum dado de status disponível.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default FinancialMetrics;
