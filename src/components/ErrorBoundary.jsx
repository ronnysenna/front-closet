import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatórios de erros
    console.error("Erro capturado por ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI de fallback
      return (
        <Container maxWidth="sm" sx={{ textAlign: "center", py: 8 }}>
          <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            Opa! Algo deu errado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Desculpe pelo inconveniente. Ocorreu um erro ao processar sua
            solicitação.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/"
              size="large"
            >
              Voltar para a página inicial
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              size="large"
            >
              Tentar novamente
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
