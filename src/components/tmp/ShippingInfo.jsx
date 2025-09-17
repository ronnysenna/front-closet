// filepath: /Users/ronnysenna/Projetos/Loja/front/src/components/ShippingInfo.jsx
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useId,
  Link,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { ASSETS_BASE_URL } from "../config";

// Imagens dos ícones das transportadoras
const jadlogIcon = `${ASSETS_BASE_URL}/image/jadlogg.png`;
const sedexIcon = `${ASSETS_BASE_URL}/image/sedex.png`;
const pacIcon = `${ASSETS_BASE_URL}/image/pac.png`;
const loggiIcon = `${ASSETS_BASE_URL}/image/loggii.png`;

const ShippingInfo = () => {
  const sectionId = useId();
  const whatsappNumber = "5585991893149"; // Substitua pelo número correto

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 4, md: 8 } }}
      id={sectionId}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: { xs: 2, md: 3 },
          overflow: "hidden",
          bgcolor: "#FBF9F6",
          width: "100%",
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        {/* Título e descrição */}
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 3, md: 4 },
            px: { xs: 2, md: 2 },
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: "#C75D47", fontWeight: 600, mb: 1 }}
          >
            Entrega Rápida e Segura
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Enviamos seus produtos para qualquer lugar do Brasil com rapidez e
            segurança. Escolha a transportadora que melhor atende às suas
            necessidades.
          </Typography>
        </Box>

        {/* Seção de benefícios */}
        <Grid container sx={{ borderTop: "1px solid #eaeaea" }}>
          {/* Envio Rápido */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              borderBottom: { xs: "1px solid #eaeaea", md: "none" },
              borderRight: { xs: "none", md: "1px solid #eaeaea" },
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  bgcolor: "#FF6B3C15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={jadlogIcon}
                  alt="Relógio"
                  style={{ width: 30, height: "auto" }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Envio Rápido
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Processamos seu pedido em até 24h após confirmação de pagamento
              </Typography>
            </Box>
          </Grid>

          {/* Cobertura Nacional */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  bgcolor: "#FF6B3C15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={jadlogIcon}
                  alt="Globo"
                  style={{ width: 30, height: "auto" }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Cobertura Nacional
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Entregamos para todos os estados e cidades do Brasil
              </Typography>
            </Box>
          </Grid>

          {/* Entrega Garantida */}
          <Grid item xs={12} sx={{ borderTop: "1px solid #eaeaea" }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  bgcolor: "#FF6B3C15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <img
                  src={jadlogIcon}
                  alt="Verificado"
                  style={{ width: 30, height: "auto" }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Entrega Garantida
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Acompanhe seu pedido com código de rastreio exclusivo
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Transportadoras */}
        <Box sx={{ bgcolor: "white", p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, textAlign: "center" }}
          >
            Trabalhamos com as melhores transportadoras
          </Typography>

          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            {[
              {
                id: "jadlog",
                icon: jadlogIcon,
                name: "Jadlog",
                description: "Entrega expressa",
              },
              {
                id: "sedex",
                icon: sedexIcon,
                name: "Sedex",
                description: "Entrega rápida",
              },
              {
                id: "pac",
                icon: pacIcon,
                name: "PAC",
                description: "Entrega econômica",
              },
              {
                id: "loggi",
                icon: loggiIcon,
                name: "Loggi",
                description: "Entrega local",
              },
            ].map((carrier) => (
              <Grid item xs={6} sm={3} key={carrier.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #eaeaea",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      height: 50,
                      width: "100%",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={carrier.icon}
                      alt={carrier.name}
                      style={{
                        height: "auto",
                        maxHeight: 40,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {carrier.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {carrier.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Informação de frete e WhatsApp */}
          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              p: { xs: 2, md: 3 },
              borderLeft: { xs: "none", md: "4px solid #FF6B3C" },
              borderTop: { xs: "4px solid #FF6B3C", md: "none" },
              bgcolor: "background.paper",
              maxWidth: 700,
              mx: "auto",
              borderRadius: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: { xs: 2, md: 1 },
                textAlign: "center",
                fontSize: { xs: "0.875rem", md: "1rem" },
              }}
            >
              O valor do frete é calculado com base no CEP, peso e dimensões do
              produto.
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#FF6B3C",
                fontWeight: 600,
                mt: { xs: 1, md: 2 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: { xs: "wrap", md: "nowrap" },
                gap: { xs: 2, md: 1 },
                textAlign: "center",
              }}
            >
              {/* Desktop: Texto + Ícone */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span>
                  Confira o prazo de entrega com seu vendedor no WhatsApp
                </span>
                <WhatsAppIcon
                  sx={{
                    color: "#25D366",
                    fontSize: 24,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={handleWhatsAppClick}
                />
              </Box>

              {/* Mobile: Apenas texto clicável */}
              <Box sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
                <Link
                  onClick={handleWhatsAppClick}
                  sx={{
                    color: "#25D366",
                    textDecoration: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Confira o prazo de entrega no WhatsApp
                </Link>
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShippingInfo;
