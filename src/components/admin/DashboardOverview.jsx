import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../utils/api";
import FinancialMetrics from "./FinancialMetrics";

// Componente de visão geral do dashboard administrativo
// Mostra estatísticas e dados obtidos da API
const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    potentialRevenue: 0,
    recentRevenue: 0,
    averageTicket: 0,
    paidOrdersCount: 0,
    paymentMethods: [],
    orderStatusStats: {},
  });

  useEffect(() => {
    // Buscar dados reais do dashboard através da API
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Buscar dados da API real
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
        setError("Não foi possível carregar as estatísticas do dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Visão Geral
      </Typography>

      {/* Cartões de estatísticas gerais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ShoppingBagIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{stats.totalProducts}</Typography>
              </Box>
              <Typography color="textSecondary">Produtos</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CategoryIcon color="secondary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{stats.totalCategories}</Typography>
              </Box>
              <Typography color="textSecondary">Categorias</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PeopleIcon sx={{ color: "#9c27b0", fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{stats.totalUsers}</Typography>
              </Box>
              <Typography color="textSecondary">Usuários</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <ShoppingCartIcon color="info" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{stats.totalOrders}</Typography>
              </Box>
              <Typography color="textSecondary">Pedidos</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Usar o componente especializado para métricas financeiras */}
      <FinancialMetrics stats={stats} loading={false} />
    </Box>
  );
};

export default DashboardOverview;
