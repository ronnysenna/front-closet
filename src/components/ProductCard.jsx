// src/components/ProductCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip, // Para o estoque
  IconButton, // Para o ícone no botão
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Ícone MUI
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone MUI
import { useCart } from '../context/CartContext'; // Mantenha seu contexto
import { Link as RouterLink } from 'react-router-dom'; // Importar Link para navegação
import { formatCurrency } from '../utils/formatCurrency'; // Mantenha seu utilitário

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        height="240" // Ou um valor que funcione bem para seu layout
        image={product.imageUrl}
        alt={product.title}
        onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Imagem+Indisponível'}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap title={product.title} sx={{ fontWeight: 'bold' }}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>
          {product.description.length > 70 ? `${product.description.substring(0, 70)}...` : product.description}
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel id={`size-label-${product.id}`}>Tamanho</InputLabel>
          <Select
            labelId={`size-label-${product.id}`}
            value={selectedSize}
            label="Tamanho"
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id={`color-label-${product.id}`}>Cor</InputLabel>
          <Select
            labelId={`color-label-${product.id}`}
            value={selectedColor}
            label="Cor"
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {product.colors.map(color => <MenuItem key={color} value={color}>{color}</MenuItem>)}
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatCurrency ? formatCurrency(parseFloat(product.price)) : `R$ ${product.price}`}
          </Typography>
          {product.stock > 0 ? (
            <Chip label={`Em estoque: ${product.stock}`} color="success" size="small" variant="outlined" />
          ) : (
            <Chip label="Esgotado" color="error" size="small" variant="outlined" />
          )}
        </Box>

      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          color={added ? "success" : "primary"}
          startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || added}
          sx={{ 
            py: 1.2,
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          {added ? "Adicionado!" : "Adicionar ao Carrinho"}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          component={RouterLink}
          to={`/product/${product.id}`} // Link para a página de detalhes
          sx={{ fontWeight: 'bold' }}
        >
          Ver Mais Detalhes
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;