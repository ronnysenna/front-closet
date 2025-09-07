import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useId, useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  // IDs únicos para os elementos de formulário
  const emailId = useId();
  const passwordId = useId();

  const location = useLocation();

  // Verifica se o usuário foi redirecionado do carrinho ou se acabou de se registrar
  const fromCart = location.state?.fromCart;
  const newRegistration = location.state?.newRegistration;
  const userEmail = location.state?.userEmail;

  const [email, setEmail] = useState(userEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    newRegistration
      ? "Registro realizado com sucesso! Por favor, faça login para continuar."
      : ""
  );

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  // Efeito para verificar se o usuário acabou de se registrar
  useEffect(() => {
    // Limpar a mensagem de sucesso após 5 segundos
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validação simples
    if (!email || !password) {
      setFormError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await login(email, password);
      // Se veio do carrinho, redireciona de volta para o carrinho
      if (fromCart) {
        navigate("/cart");
      } else {
        navigate("/"); // Redireciona para a página inicial após o login
      }
    } catch (err) {
      // Apresentar o erro de forma mais amigável para o usuário
      console.error("Erro no login:", err);
      setFormError(
        err.message === "Email ou senha incorretos"
          ? "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
          : "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde."
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Entre com sua conta para acessar a loja
          </Typography>
          {fromCart && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Por favor, faça login para finalizar sua compra
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
        </Box>

        {(error || formError) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id={emailId}
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus={!userEmail} // Só dá foco se não tiver email preenchido
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? "text" : "password"}
            id={passwordId}
            autoComplete={newRegistration ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus={!!userEmail} // Dá foco na senha se o email já estiver preenchido
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Entrar"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
              >
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link
                component={RouterLink}
                to="/register"
                state={fromCart ? { fromCart } : undefined}
                variant="body2"
              >
                {"Não tem uma conta? Cadastre-se"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
