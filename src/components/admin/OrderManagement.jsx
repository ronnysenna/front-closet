import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const OrderManagement = ({ onSuccess }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Gerenciamento de Pedidos</Typography>
      <Typography variant="body1">
        Esta é uma tela de placeholder para o gerenciamento de pedidos.
        Aqui você poderá visualizar, atualizar status e gerenciar os pedidos da loja.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }}
        onClick={() => onSuccess('Operação de exemplo bem-sucedida!')}
      >
        Teste de Notificação
      </Button>
    </Box>
  );
};

export default OrderManagement;
