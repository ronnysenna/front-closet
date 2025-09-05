import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const RotatingBanner = ({ images, whatsappLink }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Muda a imagem a cada 5 segundos

    return () => clearInterval(intervalId);
  }, [images]);

  if (!images || images.length === 0) {
    return null; // Não renderiza nada se não houver imagens
  }

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '256px', md: '320px' }, // Equivalente a h-64 e md:h-80
        backgroundColor: 'grey.800', // Fallback se imagens não carregarem
        my: 4, // Equivalente a my-8 (MUI spacing unit * 8px)
        boxShadow: 3, // Equivalente a shadow-lg
        overflow: 'hidden',
        borderRadius: 1, // Opcional: para cantos levemente arredondados
      }}
    >
      {images.map((imageUrl, index) => (
        <Box
          key={`banner-image-${index}-${imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.lastIndexOf('.'))}`}
          component="img" // Mantendo como img para objectFit, mas poderia ser um Box com backgroundImage
          src={imageUrl} // src é para img, backgroundImage para Box
          alt={`Banner Promocional ${index + 1}`}
          onError={(e) => {
            e.target.style.display = 'none'; // Esconde imagem se não carregar
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 1 : 0, // Imagem ativa na frente
            transition: 'opacity 1000ms ease-in-out',
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          inset: 0, // Equivalente a top, bottom, left, right = 0
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // bg-black bg-opacity-60
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: { xs: 2, md: 3 }, // p-4 (MUI: 2*8px = 16px)
          zIndex: 2, // Overlay na frente das imagens de fundo
          color: 'common.white', // text-white
        }}
      >
        <Typography
          variant="h3" // Ajuste conforme necessário para o tamanho
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            lineHeight: 1.2, // leading-tight
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', // shadow-text
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }, // Ajuste fino do tamanho
          }}
        >
          Venha participar do nosso <br className="sm:hidden" /> Grupo VIP no WhatsApp!
        </Typography>
        <Typography
          variant="body1" // Ajuste conforme necessário
          sx={{
            mb: 3, // mb-6 (MUI: 3*8px = 24px)
            color: 'grey.200', // text-gray-200
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', // shadow-text
            fontSize: { xs: '0.9rem', md: '1.1rem' },
          }}
        >
          Receba ofertas exclusivas, novidades e muito mais!
        </Typography>
        <Button
          variant="contained"
          href={whatsappLink || '#'} // Fallback para '#' se o link não for fornecido
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: 'success.main', // bg-green-500
            color: 'common.white',
            fontWeight: 'bold',
            py: 1.5, // py-3
            px: { xs: 3, md: 4 }, // px-8
            borderRadius: 2, // rounded-lg
            fontSize: { xs: '0.9rem', md: '1.1rem' }, // text-lg
            boxShadow: 2, // shadow-md
            transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'success.dark', // hover:bg-green-600
              transform: 'scale(1.05)', // hover:scale-105
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
