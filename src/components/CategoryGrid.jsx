import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../utils/api";

const CategoryGrid = ({ onCategoryClick, isMobile }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Não foi possível carregar as categorias.");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    navigate(`/categoria/${slug}`);
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 1 }}>
        <Alert severity="error" sx={{ fontSize: "0.875rem" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: "100%",
        p: 0,
        bgcolor: "black",
        "& .MuiListItemButton-root": {
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          py: 1.5,
          "&:last-child": {
            borderBottom: "none",
          },
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
        },
      }}
    >
      {categories.map((category) => (
        <ListItemButton
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          sx={{
            px: isMobile ? 2 : 1.5,
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "0.9rem",
              fontWeight: 400,
            }}
          >
            {category.name}
          </Typography>
        </ListItemButton>
      ))}
    </List>
  );
};

export default CategoryGrid;
