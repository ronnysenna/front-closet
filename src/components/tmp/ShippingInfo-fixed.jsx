// filepath: /Users/ronnysenna/Projetos/Loja/front/src/components/ShippingInfo.jsx
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { ASSETS_BASE_URL } from "../config";
import { useId } from "react";

// Imagens dos ícones das transportadoras
const jadlogIcon = `${ASSETS_BASE_URL}/image/jadlogg.png`;
const sedexIcon = `${ASSETS_BASE_URL}/image/sedex.png`;
const pacIcon = `${ASSETS_BASE_URL}/image/pac.png`;
const loggiIcon = `${ASSETS_BASE_URL}/image/loggii.png`;
const whatsappIcon = `${ASSETS_BASE_URL}/image/whatsapp (1).png`;

const ShippingInfo = () => {
  const theme = useTheme();
  const sectionId = useId();

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }} id={sectionId}>
      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#FBF9F6",
          width: "100%",
          maxWidth: "1000px",
          mx: "auto",
        }}
      >
        {/* Título e descrição */}
        <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
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
                  src={`${ASSETS_BASE_URL}/image/jadlogg.png`}
                  alt="Relógio"
                  style={{
                    width: 30,
                    height: "auto",
                  }}
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
                  src={`${ASSETS_BASE_URL}/image/jadlogg.png`}
                  alt="Globo"
                  style={{
                    width: 30,
                    height: "auto",
                  }}
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
                  src={`${ASSETS_BASE_URL}/image/jadlogg.png`}
                  alt="Verificado"
                  style={{
                    width: 30,
                    height: "auto",
                  }}
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
        <Box sx={{ bgcolor: "white", p: 4, width: "100%" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3,
              textAlign: "center",
            }}
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
              mt: 4,
              p: 3,
              borderLeft: "4px solid #FF6B3C",
              bgcolor: "background.paper",
              maxWidth: 700,
              mx: "auto",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, textAlign: "center" }}
            >
              O valor do frete é calculado com base no CEP, peso e dimensões do
              produto.
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#FF6B3C",
                fontWeight: 600,
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Confira o prazo de entrega com seu vendedor no WhatsApp
              <Box
                component="img"
                src={whatsappIcon}
                alt="WhatsApp"
                sx={{ width: 24, height: 24, ml: 1 }}
              />
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShippingInfo;
