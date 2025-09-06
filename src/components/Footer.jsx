import { Box, Divider, Grid, IconButton, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const instagramUser = 'https://www.instagram.com/closettmodafitness_?igsh=MTB1b3c5NWRlYm1kZA==';
  const whatsappNumber = '5585991893149';

  return (
    <Box
      component="footer"
      className="modern-footer full-width-container"
      sx={{
        bgcolor: '#000',
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
        <Grid item xs={6} sm={3} md={2}>
          <Typography
            variant="subtitle2"
            className="footer-header"
            sx={{ color: '#FFFFFF', borderBottom: 'none !important', pb: 0 }}
          >
            Navegação
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            <Link
              component={RouterLink}
              to="/"
              className="footer-link"
              sx={{
                color: '#B3B3B3',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'none', color: '#ff6923' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <HomeOutlinedIcon sx={{ fontSize: 18 }} /> Home
            </Link>
            <Link
              component={RouterLink}
              to="/cart"
              className="footer-link"
              sx={{
                color: '#B3B3B3',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'none', color: '#ff6923' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} /> Carrinho
            </Link>
            <Link
              component={RouterLink}
              to="/feedback"
              className="footer-link"
              sx={{
                color: '#B3B3B3',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'none', color: '#ff6923' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <FeedbackOutlinedIcon sx={{ fontSize: 18 }} /> Feedback
            </Link>
            <Link
              component={RouterLink}
              to="/login"
              className="footer-link"
              sx={{
                color: '#B3B3B3',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'none', color: '#ff6923' },
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <LoginOutlinedIcon sx={{ fontSize: 18 }} /> Entrar
            </Link>
          </Box>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <img
                src="/image/cmf-preto.jpeg"
                alt="Closet Moda Fitness"
                style={{
                  maxWidth: '100px',
                  height: 'auto',
                  marginBottom: '6px',
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
                  href="https://facebook.com/closettmodafitness"
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
                  <FacebookIcon fontSize="small" />
                </IconButton>
              </Stack>
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
