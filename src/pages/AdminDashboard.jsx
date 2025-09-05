import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  CircularProgress, 
  Alert, 
  Snackbar
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import DashboardOverview from '../components/admin/DashboardOverview';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Verificar permissões aqui se necessário
    if (!isAdmin) {
      setError('Você não tem permissão para acessar esta página.');
    }
  }, [isAdmin]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Painel Administrativo
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Bem-vindo, {user?.name || 'Administrador'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aqui você pode gerenciar produtos, categorias, pedidos e usuários.
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Produtos" {...a11yProps(1)} />
            <Tab label="Categorias" {...a11yProps(2)} />
            <Tab label="Pedidos" {...a11yProps(3)} />
            <Tab label="Usuários" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DashboardOverview onSuccess={handleSuccess} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ProductManagement onSuccess={handleSuccess} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CategoryManagement onSuccess={handleSuccess} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <OrderManagement onSuccess={handleSuccess} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <UserManagement onSuccess={handleSuccess} />
        </TabPanel>
      </Paper>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default AdminDashboard;
