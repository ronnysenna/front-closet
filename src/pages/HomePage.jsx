// src/pages/HomePage.jsx
/** biome-ignore-all assist/source/organizeImports: Importações organizadas manualmente para manter a ordem específica por relevância de componentes */
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Fade,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import ProductList from "../components/ProductList";
import ProductSearchBar from "../components/ProductSearchBar";
import ShippingInfo from "../components/ShippingInfo";
import HighlightBanner from "../components/HighlightBanner";
import { getAllProducts } from "../utils/api";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (_) {
        setError(
          "Erro ao carregar produtos. Por favor, tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <HighlightBanner
        images={[
          "/image/capa1.png", 
          "/image/capa2.png", 
          "/image/capa4.png",
        ]}
        interval={10000}
      />

      <Box
        sx={{
          background: "linear-gradient(135deg, #ff69230d 0%, #ff47880d 100%)",
          py: { xs: 4, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Fade in={true} timeout={1000}>
            <Box textAlign="center" position="relative" zIndex={2}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: isMobile ? "2.5rem" : "4rem",
                  fontWeight: 800,
                  mb: 3,
                  background:
                    "linear-gradient(45deg, #ff6923 30%, #ff4788 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Seu Estilo, Sua Atitude
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  maxWidth: "800px",
                  mx: "auto",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Performance e estilo em cada detalhe. e bem-estar
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
            }}
          >
            <ProductSearchBar onSearch={setSearchTerm} />
          </Paper>
        </Box>

        <Box sx={{ mb: 8 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Carregando produtos...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </Box>
          ) : (
            <ProductList products={filteredProducts} />
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
            }}
          >
            <ShippingInfo />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
