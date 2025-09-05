import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const UserManagement = ({ onSuccess }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Gerenciamento de Usuários</Typography>
      <Typography variant="body1">
        Esta é uma tela de placeholder para o gerenciamento de usuários.
        Aqui você poderá visualizar, adicionar, editar e remover usuários do sistema.
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

export default UserManagement;
