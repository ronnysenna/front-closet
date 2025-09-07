import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

// Este é um componente temporário para a página de perfil
const ProfilePlaceholder = () => {
  const { user, logout, updateProfile, loading } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Abre o diálogo de edição e inicializa o formulário com os dados atuais
  const handleOpenDialog = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Limpa o erro quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    // Validação de senha apenas se o usuário estiver tentando alterá-la
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword =
          "Senha atual é obrigatória para alterar a senha";
      }

      if (!formData.newPassword) {
        errors.newPassword = "Nova senha é obrigatória";
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = "A senha deve ter pelo menos 6 caracteres";
      }

      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "As senhas não conferem";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação do formulário
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Preparar dados para envio
      const userData = {
        name: formData.name,
        email: formData.email,
      };

      // Incluir senhas apenas se o usuário estiver tentando alterá-las
      if (formData.newPassword && formData.currentPassword) {
        userData.currentPassword = formData.currentPassword;
        userData.newPassword = formData.newPassword;
      }

      // Chamar a API para atualizar o perfil
      await updateProfile(userData);

      // Fechar o diálogo e mostrar mensagem de sucesso
      handleCloseDialog();
      setNotification({
        open: true,
        message: "Perfil atualizado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setNotification({
        open: true,
        message: error.message || "Erro ao atualizar perfil. Tente novamente.",
        severity: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 8, textAlign: "center" }}>
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
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              {user.name}
            </Typography>

            <Typography variant="subtitle1">Email:</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              {user.email}
            </Typography>

            <Typography variant="subtitle1">Função:</Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              {user.role === "ADMIN" ? "Administrador" : "Cliente"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informações da Conta
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Membro desde:{" "}
              {new Date(user.createdAt).toLocaleDateString("pt-BR")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID da conta: {user.id}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenDialog}
              fullWidth
              sx={{ mr: 1 }}
            >
              Editar Perfil
            </Button>
            <Button
              variant="outlined"
              color="success"
              component="a"
              href="/my-orders"
              fullWidth
              sx={{ ml: 1 }}
            >
              Meus Pedidos
            </Button>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={logout}
            fullWidth
            sx={{ mt: 1 }}
          >
            Sair da Conta
          </Button>
        </Box>
      </Paper>

      {/* Diálogo de edição do perfil */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Alterar Senha (opcional)
              </Typography>
            </Divider>
            <TextField
              margin="normal"
              fullWidth
              id="currentPassword"
              label="Senha Atual"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={!!formErrors.currentPassword}
              helperText={formErrors.currentPassword}
            />
            <TextField
              margin="normal"
              fullWidth
              id="newPassword"
              label="Nova Senha"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!formErrors.newPassword}
              helperText={formErrors.newPassword}
            />
            <TextField
              margin="normal"
              fullWidth
              id="confirmPassword"
              label="Confirmar Nova Senha"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificação de feedback */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePlaceholder;
