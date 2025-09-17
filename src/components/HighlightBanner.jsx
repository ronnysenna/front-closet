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
        minHeight: { xs: 190, md: 750 }, // altura menor no mobile
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 0,
        boxShadow: 3,
        mb: { xs: 2, md: 4 }, // menos margem no mobile
        mt: -3,
        pt: 0,
        background: "linear-gradient(90deg, #FF6B3C 0%, #FFB347 100%)",
      }}
    >
      <Box
        component="img"
        src={images[current]}
        alt="Destaque"
        sx={{
          width: "100%",
          height: { xs: 190, md: 750 }, // altura menor no mobile, desktop mantido
          objectFit: "cover", // imagem sempre visível e centralizada
          borderRadius: 0,
          transition: "opacity 0.5s",
          background: "#fff", // opcional: fundo branco para imagens menores
        }}
      />
    </Box>
  );
};

export default HighlightBanner;
