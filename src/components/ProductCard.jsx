// src/components/ProductCard.jsx

import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone MUI
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Ícone MUI
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useId, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Importar Link para navegação
import { useCart } from '../context/CartContext'; // Mantenha seu contexto
import { formatCurrency } from '../utils/formatCurrency'; // Mantenha seu utilitário

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Gerar IDs únicos para os componentes
  const sizeSelectId = useId();
  const colorSelectId = useId();

  // Define tamanhos e cores padrão
  const defaultSizes = ['P', 'M', 'G'];
  const defaultColors = ['Preto', 'Branco', 'Rosa'];

  // Usa as propriedades do produto se existirem, ou valores padrão
  const sizes = Array.isArray(product.sizes) ? product.sizes : defaultSizes;
  const colors = Array.isArray(product.colors) ? product.colors : defaultColors;

  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : '');
  const [selectedColor, setSelectedColor] = useState(colors.length > 0 ? colors[0] : '');
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        minHeight: { xs: 420, sm: 440, md: 480 },
        maxWidth: { xs: '100%', md: 320 },
        mx: 'auto',
        borderRadius: 2,
        boxShadow: 3,
        boxSizing: 'border-box',
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={product.main_image}
        alt={product.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400?text=Imagem+Indisponível';
        }}
        sx={{
          objectFit: 'cover',
          width: '100%',
          maxWidth: { xs: '100%', md: 280 },
          mx: 'auto',
          borderRadius: 2,
          transition: 'width 0.2s',
        }}
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 220,
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          noWrap
          title={product.name}
          sx={{ fontWeight: 'bold' }}
        >
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px', mb: 2 }}>
          {product.description && product.description.length > 70
            ? `${product.description.substring(0, 70)}...`
            : product.description || product.short_description || 'Sem descrição disponível'}
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel id={`size-label-${sizeSelectId}`}>Tamanho</InputLabel>
          <Select
            labelId={`size-label-${sizeSelectId}`}
            value={selectedSize}
            label="Tamanho"
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id={`color-label-${colorSelectId}`}>Cor</InputLabel>
          <Select
            labelId={`color-label-${colorSelectId}`}
            value={selectedColor}
            label="Cor"
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            {colors.map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            {formatCurrency ? formatCurrency(parseFloat(product.price)) : `R$ ${product.price}`}
          </Typography>
          {/* {product.stock > 0 ? (
            <Chip label={`Em estoque: ${product.stock}`} color="success" size="small" variant="outlined" />
          ) : (
            <Chip label="Esgotado" color="error" size="small" variant="outlined" />
          )} */}
        </Box>
      </CardContent>
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color={added ? 'success' : 'primary'}
          startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || added}
          sx={{
            py: 1.2,
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          {added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
        </Button>
        <Button
          fullWidth
          variant="outlined"
          component={RouterLink}
          Add
          commentMore
          actions
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
