import { Box, IconButton } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useId } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Função para gerar um UUID simples
const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const slideStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  background: "#fff",
  borderRadius: { xs: "16px", md: "24px" },
  position: "relative",
};

const imageStyles = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "scale(1.015)",
  },
};

const HighlightBanner = ({ images = [] }) => {
  const prevButtonId = useId();
  const nextButtonId = useId();

  // Preparando as imagens com IDs únicos
  const preparedImages = images.map((image) => ({
    id: generateId(),
    src: typeof image === "string" ? image : image.url,
    alt:
      typeof image === "string"
        ? "Imagem de destaque"
        : image.alt || "Imagem de destaque",
  }));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        mt: { xs: 10, sm: 11, md: 12 }, // Aumentando a margem superior
        pt: { xs: 2, sm: 3, md: 4 }, // Adicionando padding superior
        px: { xs: 2, sm: 3, md: 4 },
        "& .swiper": {
          width: "100%",
          height: {
            xs: "calc((100vw - 32px) / 2.74)",
            sm: "calc((100vw - 48px) / 2.74)",
            md: "calc((100vw - 64px) / 2.74)",
          },
          maxHeight: { xs: "280px", sm: "400px", md: "700px" },
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
        },
        "& .swiper-slide": {
          backgroundColor: "#f5f5f5",
          borderRadius: { xs: "16px", md: "24px" },
          overflow: "hidden",
        },
        "& .swiper-slide-active": {
          zIndex: 1,
        },
        "& .custom-navigation-button": {
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: { xs: "36px", md: "44px" },
          height: { xs: "36px", md: "44px" },
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: "#000",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "#fff",
          },
        },
      }}
    >
      <IconButton
        className="custom-navigation-button"
        sx={{ left: { xs: "10px", md: "20px" } }}
        id={prevButtonId}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <Swiper
        modules={[Navigation, Autoplay, EffectFade]}
        navigation={{
          prevEl: `#${prevButtonId}`,
          nextEl: `#${nextButtonId}`,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={800}
      >
        {preparedImages.map((image) => (
          <SwiperSlide key={image.id}>
            <Box sx={slideStyles}>
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={imageStyles}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <IconButton
        className="custom-navigation-button"
        sx={{ right: { xs: "10px", md: "20px" } }}
        id={nextButtonId}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default HighlightBanner;
