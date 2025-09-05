import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const RotatingBanner = ({ images }) => {
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
        position: "relative",
        width: "100%",
        height: { xs: 220, sm: 280, md: 340 },
        backgroundColor: "#181828", // tom escuro elegante
        my: { xs: 3, md: 5 },
        boxShadow: 2,
        overflow: "hidden",
        borderRadius: { xs: 2, md: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 0, md: 0 },
      }}
    >
      {images.map((imageUrl, index) => (
        <Box
          key={`banner-image-${index}-${imageUrl.substring(
            imageUrl.lastIndexOf("/") + 1,
            imageUrl.lastIndexOf(".")
          )}`}
          component="img"
          src={imageUrl}
          alt={`Banner Promocional ${index + 1}`}
          onError={(e) => {
            e.target.style.display = "none";
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? 1 : 0,
            transition: "opacity 1000ms cubic-bezier(.4,0,.2,1)",
            borderRadius: { xs: 2, md: 3 },
          }}
        />
      ))}
      {/* Overlay para dar leve escurecida e destacar conteúdo futuro */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(24,24,40,0.25) 0%, rgba(24,24,40,0.45) 100%)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};

export default RotatingBanner;
