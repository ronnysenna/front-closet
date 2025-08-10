// src/components/RotatingBanner.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const RotatingBanner = ({ images, whatsappLink }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 5000); // Muda a imagem a cada 5 segundos

    return () => clearInterval(intervalId);
  }, [images]);

  if (!images || images.length === 0) {
    return null; // Não renderiza nada se não houver imagens
  }

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '340px', sm: '420px', md: '520px', lg: '600px' }, // Banner mais alto e responsivo
        my: { xs: 2, sm: 4, md: 6 }, // Mais espaçamento em telas maiores
        boxShadow: 6, // Sombra mais forte para destaque visual
        borderRadius: { xs: 2, md: 4 }, // Cantos mais arredondados em telas grandes
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {images.map((imageUrl, index) => (
        <Box
          key={index}
          component="img"
          src={imageUrl}
          alt={`Banner Promocional ${index + 1}`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: 'brightness(0.95) saturate(1.2)',
            objectFit: 'cover',
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 1 : 0,
            transition: 'opacity 1000ms ease-in-out',
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: { xs: 2, sm: 3, md: 5 },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.1,
            textShadow: '2px 2px 8px rgba(255, 255, 255, 0.8)',
            fontSize: { xs: '2.1rem', sm: '2.7rem', md: '3.5rem', lg: '4rem' },
            letterSpacing: { xs: '0.5px', md: '1.5px' },
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          Venha participar do nosso <br className="sm:hidden" /> Grupo VIP no WhatsApp!
        </Typography>
        <Typography
          sx={{
            textShadow: '1px 1px 6px rgba(0,0,0,0.7)',
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
            maxWidth: { xs: '90%', sm: '70%', md: '60%' },
            mb: 3,
            color: 'grey.200',
          }}
        >
          Receba ofertas exclusivas, novidades e muito mais!
        </Typography>
        <Button
          variant="contained"
          href={whatsappLink || "#"}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            py: { xs: 1.5, sm: 2, md: 2.5 },
            px: { xs: 4, sm: 6, md: 8 },
            borderRadius: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
            boxShadow: 4,
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'success.dark',
              transform: 'scale(1.05)',
            },
          }}
        >
          Entrar no Grupo VIP
        </Button>
      </Box>
    </Box>
  );
};

export default RotatingBanner;
