import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useId } from "react";

// Caminhos das imagens das transportadoras
const TRANSPORTADORAS = [
  {
    id: "jadlog",
    icon: "/image/jadlog.png",
    name: "Jadlog",
    description: "Entrega expressa",
  },
  {
    id: "sedex",
    icon: "/image/sedex.png",
    name: "Sedex",
    description: "Entrega rápida",
  },
  {
    id: "pac",
    icon: "/image/pac.png",
    name: "PAC",
    description: "Entrega econômica",
  },
  {
    id: "loggi",
    icon: "/image/loggi.png",
    name: "Loggi",
    description: "Entrega local",
  },
];

const ShippingInfo = () => {
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
            md={4}
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
                <AccessTimeIcon sx={{ fontSize: 30, color: "#FF6B3C" }} />
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
          <Grid item xs={12} md={4}>
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
                <PublicIcon sx={{ fontSize: 30, color: "#FF6B3C" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Cobertura Nacional
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Entregamos para todos os estados e cidades do Brasil
              </Typography>
            </Box>
          </Grid>

          {/* Entrega Garantida 
          <Grid
            item
            xs={12}
            md={4}
            sx={{ borderTop: { xs: "1px solid #eaeaea", md: "none" } }}
          >
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
                <VerifiedIcon sx={{ fontSize: 30, color: "#FF6B3C" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1 }}
                align="center"
              >
                Entrega Garantida
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Acompanhe seu pedido com código de rastreio exclusivo
              </Typography>
            </Box>
          </Grid>*/}
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
            {TRANSPORTADORAS.map((carrier) => (
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
                        filter: "grayscale(0.1)",
                      }}
                      onError={(e) => {
                        console.error(
                          `Erro ao carregar imagem: ${carrier.icon}`
                        );
                        e.target.onerror = null;
                        e.target.src = "/image/not-found.svg";
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
            </Typography>{" "}
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
                component="a"
                href="https://wa.me/5585991893149"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1, display: "flex", alignItems: "center" }}
              >
                <Box
                  component="img"
                  src="/image/whatsapp.png"
                  alt="WhatsApp"
                  sx={{ width: 24, height: 24 }}
                  onError={(e) => {
                    console.error("Erro ao carregar imagem do WhatsApp");
                    e.target.onerror = null;
                    e.target.src = "/image/not-found.svg";
                  }}
                />
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ShippingInfo;
