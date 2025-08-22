import React from 'react';
import { Box, Button, Typography, Container, Paper, Stack, Link } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const CatalogoPage = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight={700} gutterBottom align="center">
          Acesse nossos canais
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Fique à vontade para acessar nosso site, catálogo de produtos ou falar diretamente com nosso atendimento via WhatsApp. Tudo pensado para facilitar sua experiência!
        </Typography>
        <Stack spacing={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LanguageIcon />}
            href="https://gofashion.click"
            target="_blank"
            fullWidth
            sx={{ fontWeight: 600, fontSize: '1.1rem' }}
          >
            Ir para o site Gofashion
          </Button>
          <Button
            variant="contained"
            sx={{ background: '#25D366', color: 'white', fontWeight: 600, fontSize: '1.1rem' }}
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/c/558597173941"
            target="_blank"
            fullWidth
          >
            Ver Catálogo no WhatsApp
          </Button>
          <Button
            variant="contained"
            sx={{ background: '#e91e63', color: 'white', fontWeight: 600, fontSize: '1.1rem' }}
            startIcon={<ContactPhoneIcon />}
            href="https://wa.me/558597173941"
            target="_blank"
            fullWidth
          >
            Atendimento via WhatsApp
          </Button>
        </Stack>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Atendimento rápido, catálogo atualizado e site seguro para você comprar com tranquilidade!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CatalogoPage;
