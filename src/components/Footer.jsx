// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, IconButton, Grid } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link as RouterLink } from 'react-router-dom'; // Para links internos

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const instagramUser = "https://www.instagram.com/gofashion_brasil?igsh=MWwyNnZpZXhmMjI5eA=="; // Coloque seu usuário do Instagram
  const whatsappNumber = "5585997173941"; // Coloque seu número de WhatsApp (ex: 5585912345678)

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main', // Usa a cor primária (rosa)
        color: 'primary.contrastText', // Texto branco ou de alto contraste
        py: 4, // Padding vertical
        mt: 'auto', // Empurra para o final da página se o conteúdo for curto
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Gofashion
            </Typography>
            <Typography variant="body2">
              Moda e estilo para todos os momentos. Encontre as melhores peças aqui.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Links Rápidos
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>Home</Link>
            <Link component={RouterLink} to="/cart" color="inherit" display="block" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>Carrinho</Link>
            {/* Adicione outros links como 'Sobre Nós', 'Contato' se tiver as páginas */}
            <Link href="#" color="inherit" display="block" sx={{ mb: 0.5, '&:hover': { textDecoration: 'underline' } }}>Política de Privacidade</Link>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Siga-nos
            </Typography>
            <IconButton
              aria-label="Instagram"
              color="inherit"
              href={`${instagramUser}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { transform: 'scale(1.1)' } }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              aria-label="WhatsApp"
              color="inherit"
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ '&:hover': { transform: 'scale(1.1)' } }}
            >
              <WhatsAppIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ pt: 4, mt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          &copy; {currentYear} Gofashion. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;