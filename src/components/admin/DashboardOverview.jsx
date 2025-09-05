import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Box, Card, CardContent, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// Este é um componente placeholder para o dashboard administrativo
// Em uma implementação real, você buscaria esses dados da API
const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalOrders: 0,
    recentOrders: [],
    revenue: {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    },
  });

  useEffect(() => {
    // Simula uma chamada de API para buscar estatísticas
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Em uma implementação real, você faria uma chamada de API aqui
        // const response = await fetchDashboardStats();

        // Por enquanto, usamos dados simulados
        setTimeout(() => {
          setStats({
            totalProducts: 125,
            totalCategories: 8,
            totalUsers: 350,
            totalOrders: 1250,
            recentOrders: [
              {
                id: 1,
                customer: 'Maria Silva',
                total: 259.9,
                status: 'Entregue',
              },
              {
                id: 2,
                customer: 'João Santos',
                total: 127.5,
                status: 'Em processamento',
              },
              {
                id: 3,
                customer: 'Ana Oliveira',
                total: 348.0,
                status: 'Em entrega',
              },
            ],
            revenue: {
              total: 125000,
              today: 1250,
              thisWeek: 7850,
              thisMonth: 32500,
            },
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setError('Não foi possível carregar as estatísticas do dashboard.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Visão Geral
      </Typography>

      {/* Cartões de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ color: '#9c27b0', fontSize: 40, mr: 1 }} />
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ color: '#4caf50', fontSize: 40, mr: 1 }} />
                <Typography variant="h4">{stats.totalOrders}</Typography>
              </Box>
              <Typography color="textSecondary">Pedidos</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resumo de receitas */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Receitas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ backgroundColor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Hoje
                </Typography>
                <Typography variant="h6">{formatCurrency(stats.revenue.today)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ backgroundColor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Esta Semana
                </Typography>
                <Typography variant="h6">{formatCurrency(stats.revenue.thisWeek)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ backgroundColor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Este Mês
                </Typography>
                <Typography variant="h6">{formatCurrency(stats.revenue.thisMonth)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ backgroundColor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="textSecondary">
                  Total
                </Typography>
                <Typography variant="h6">{formatCurrency(stats.revenue.total)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Pedidos Recentes */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Pedidos Recentes
        </Typography>
        {stats.recentOrders.map((order) => (
          <Card key={order.id} variant="outlined" sx={{ mb: 1 }}>
            <CardContent sx={{ py: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="body2" color="textSecondary">
                    #{order.id}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">{order.customer}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{formatCurrency(order.total)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        order.status === 'Entregue'
                          ? 'green'
                          : order.status === 'Cancelado'
                            ? 'red'
                            : 'orange',
                    }}
                  >
                    {order.status}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Paper>
    </Box>
  );
};

export default DashboardOverview;
