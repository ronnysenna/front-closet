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
import { useId, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../utils/api";

const RegisterPage = () => {
  // IDs únicos para os elementos de formulário
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId(); // Adicionado ID para o campo de telefone
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Adicionado campo de telefone
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Controle para visualização da senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Controle para visualização da confirmação de senha
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se o usuário foi redirecionado do carrinho
  const fromCart = location.state?.fromCart;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validação avançada
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação do formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, insira um endereço de email válido.");
      return;
    }

    // Validação do telefone (formato brasileiro)
    const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Por favor, insira um número de telefone válido no formato (00) 00000-0000."
      );
      return;
    }

    // Validação da senha
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      // Enviando apenas os dados necessários, sem o confirmPassword
      const { confirmPassword: _confirmPassword, ...userData } = formData;
      const response = await registerUser(userData);
      setSuccess(true);

      // Armazenar os dados para login automático
      const loginData = {
        email: formData.email,
        name: response.user.name,
      };

      // Salvar no sessionStorage para facilitar o login subsequente
      sessionStorage.setItem("registeredUser", JSON.stringify(loginData));

      // Redirecionamento com timeout para mostrar a mensagem de sucesso
      setTimeout(() => {
        // Se veio do carrinho, redireciona de volta para o login com contexto
        if (fromCart) {
          navigate("/login", {
            state: {
              fromCart: true,
              newRegistration: true,
              userEmail: formData.email,
            },
          });
        } else {
          navigate("/login", {
            state: {
              newRegistration: true,
              userEmail: formData.email,
            },
          });
        }
      }, 2000);
    } catch (err) {
      setError(err.message || "Erro ao registrar. Por favor, tente novamente.");
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Criar Conta
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Preencha os dados abaixo para se cadastrar
          </Typography>
          {fromCart && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Para finalizar sua compra, é necessário criar uma conta ou fazer
              login.
            </Alert>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Cadastro realizado com sucesso! Redirecionando para o login...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id={nameId}
            label="Nome completo"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id={emailId}
            label="Email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id={phoneId}
            label="Telefone"
            name="phone"
            autoComplete="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type={showPassword ? "text" : "password"}
            id={passwordId}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirme a senha"
            type={showConfirmPassword ? "text" : "password"}
            id={confirmPasswordId}
            value={formData.confirmPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : "Registrar"}
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link
                component={RouterLink}
                to="/login"
                state={fromCart ? { fromCart } : undefined}
                variant="body2"
              >
                {"Já tem uma conta? Faça login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
