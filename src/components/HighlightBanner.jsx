import { Box } from "@mui/material";
import { useEffect, useState } from "react";

const HighlightBanner = ({
  images = [],

  interval = 10000, // tempo em ms para trocar imagem
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        minHeight: { xs: 160, md: 750 }, // altura maior
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 0, // sem borda arredondada
        boxShadow: 3,
        mb: { xs: 3, md: 4 },
        mt: -3, // sem espaço no topo
        pt: 0, // sem padding top
        background: "linear-gradient(90deg, #FF6B3C 0%, #FFB347 100%)",
      }}
    >
      <Box
        component="img"
        src={images[current]}
        alt="Destaque"
        sx={{
          width: "100%",
          height: { xs: 160, md: 750 }, 
          objectFit: "cover", // ajuste para conter a imagem
          borderRadius: 0, // sem borda arredondada
          transition: "opacity 0.5s",
        }}
      />
    </Box>
  );
};

export default HighlightBanner;
