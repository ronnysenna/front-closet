// src/components/Footer.jsx
// Material-UI components

// Material-UI icons
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Divider, Grid, IconButton, Link, Stack, Typography } from '@mui/material';

// Router
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const instagramUser = 'https://www.instagram.com/closetmodafitness?igsh=MWwyNnZpZXhmMjI5eA==';
  const whatsappNumber = '5585997173941';

  // Categorias para o footer
  const categories = [
    { text: 'Babydoll', path: '/categoria/babydoll' },
    { text: 'Camisola', path: '/categoria/camisola' },
    { text: 'Infantil', path: '/categoria/infantil' },
    { text: 'Conjunto casal', path: '/categoria/conjunto casal' },
    { text: 'Americano', path: '/categoria/americano' },
  ];

  return (
    <Box
      component="footer"
      className="modern-footer full-width-container"
      sx={{
        bgcolor: '#1A1A2E',
        color: '#B3B3B3',
        py: { xs: 4, md: 6 },
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        width: '100vw',
        position: 'relative',
        left: 0,
        right: 0,
        padding: 0,
        margin: 0,
      }}
    >
      <Box className="content-container">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <img
                src="/icon-removebg-preview.png"
                alt="Gofashion"
                style={{
                  maxWidth: '130px',
                  height: 'auto',
                  marginBottom: '16px',
                }}
              />
              <Typography variant="body2" sx={{ mb: 2, maxWidth: '90%', color: '#B3B3B3' }}>
                Moda e conforto para todos os momentos. Descubra nossa coleção exclusiva de peças
                que combinam estilo, qualidade e preços acessíveis.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  href={instagramUser}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    color: '#B3B3B3',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener"
                  size="small"
                  sx={{
                    color: '#B3B3B3',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: '#B3B3B3',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" className="footer-header" sx={{ color: '#FFFFFF' }}>
              Navegação
            </Typography>
            <Link component={RouterLink} to="/" className="footer-link" sx={{ color: '#B3B3B3' }}>
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/cart"
              className="footer-link"
              sx={{ color: '#B3B3B3' }}
            >
              Carrinho
            </Link>
            <Link
              component={RouterLink}
              to="/feedback"
              className="footer-link"
              sx={{ color: '#B3B3B3' }}
            >
              Feedback
            </Link>
            <Link
              component={RouterLink}
              to="/login"
              className="footer-link"
              sx={{ color: '#B3B3B3' }}
            >
              Entrar
            </Link>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle2" className="footer-header" sx={{ color: '#FFFFFF' }}>
              Categorias
            </Typography>
            {categories.map((category) => (
              <Link
                key={category.path}
                component={RouterLink}
                to={category.path}
                className="footer-link"
                sx={{ color: '#B3B3B3' }}
              >
                {category.text}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" className="footer-header" sx={{ color: '#FFFFFF' }}>
              Contato
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <LocalPhoneIcon sx={{ fontSize: '1rem', mr: 1, color: 'primary.light' }} />
              <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                +55 (85) 99717-3941
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <EmailIcon sx={{ fontSize: '1rem', mr: 1, color: 'primary.light' }} />
              <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                contato@closetmodafitness.com.br
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 1.5 }}>
              <LocationOnIcon
                sx={{
                  fontSize: '1rem',
                  mr: 1,
                  color: 'primary.light',
                  mt: 0.3,
                }}
              />
              <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                Rua Exemplo, 123 - Fortaleza, CE
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
            &copy; {currentYear} Closet Moda Fitness. Todos os direitos reservados.
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#999999' }}>
            Desenvolvido com ❤️ para melhor experiência de compra
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
