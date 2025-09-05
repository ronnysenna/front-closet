import { Box, Button, Container, Divider, Grid, Paper, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Este é um componente temporário para a página de perfil
const ProfilePlaceholder = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
        <Typography variant="h4">Carregando perfil...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Meu Perfil
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Nome:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {user.name}
            </Typography>

            <Typography variant="subtitle1">Email:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {user.email}
            </Typography>

            <Typography variant="subtitle1">Função:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informações da Conta
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Membro desde: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID da conta: {user.id}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="primary">
            Editar Perfil
          </Button>
          <Button variant="contained" color="error" onClick={logout}>
            Sair da Conta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePlaceholder;
