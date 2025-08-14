// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { products as allProducts } from '../data/products'; // Importar a lista de produtos real


function ProductDetailPage() {
  const { id: productId } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Simula uma chamada de API
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      // Busca o produto na lista importada
      // Converte ambos os IDs para string para garantir a comparação correta
      const foundProduct = allProducts.find(p => String(p.id) === String(productId));

      if (foundProduct) {
        setProduct(foundProduct);
        // Define os valores iniciais para os seletores se o produto for encontrado
        // Verifica se sizes e colors existem e não estão vazios antes de tentar acessar o primeiro elemento
        if (foundProduct.sizes?.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors?.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      } else {
        setError('Produto não encontrado.');
      }
      setLoading(false);
    }, 500); // Simula um pequeno atraso de rede
    return () => clearTimeout(timer);
  }, [productId]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, 1, selectedSize, selectedColor);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      // Poderia adicionar um feedback mais explícito se tamanho/cor não selecionados
      console.warn("Selecione tamanho e cor antes de adicionar ao carrinho.");
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando detalhes do produto...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button component={RouterLink} to="/" variant="outlined">
          Voltar para Home
        </Button>
      </Container>
    );
  }

  if (!product) {
    // Este caso pode não ser alcançado se o error state for tratado primeiro, mas é uma boa salvaguarda.
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Produto não encontrado.</Typography>
        <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 2 }}>
          Voltar para Home
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600x800?text=Imagem+Indisponível'}
              alt={product.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => e.target.src = 'https://via.placeholder.com/600x800?text=Imagem+Indisponível'}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {product.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            {product.description}
          </Typography>

          {product.category && (
            <Typography variant="overline" display="block" color="text.secondary" gutterBottom>
              Categoria: {product.category}
            </Typography>
          )}

          <FormControl fullWidth sx={{ my: 2 }} disabled={product.stock === 0}>
            <InputLabel id={`size-label-detail-${product.id}`}>Tamanho</InputLabel>
            <Select
              labelId={`size-label-detail-${product.id}`}
              value={selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : '')}
              label="Tamanho"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {product.sizes.map(size => <MenuItem key={size} value={size}>{size}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} disabled={product.stock === 0}>
            <InputLabel id={`color-label-detail-${product.id}`}>Cor</InputLabel>
            <Select
              labelId={`color-label-detail-${product.id}`}
              value={selectedColor || (product.colors?.length > 0 ? product.colors[0] : '')}
              label="Cor"
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {product.colors.map(color => <MenuItem key={color} value={color}>{color}</MenuItem>)}
            </Select>
          </FormControl>
          

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {formatCurrency ? formatCurrency(parseFloat(product.price)) : `R$ ${product.price}`}
            </Typography>
            {product.stock > 0 ? (
              <Chip label={`Em estoque: ${product.stock}`} color="success" variant="outlined" />
            ) : (
              <Chip label="Esgotado" color="error" variant="outlined" />
            )}
          </Box> */
          }

          <Button
            fullWidth
            variant="contained"
            color={added ? "success" : "primary"}
            startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || added || !selectedSize || !selectedColor}
            sx={{ py: 1.5, fontWeight: 'bold', mt: 2, mb: 2 }}
          >
            {added ? "Adicionado ao Carrinho!" : "Adicionar ao Carrinho"}
          </Button>

          {product.details && product.details.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Mais Detalhes:</Typography>
              <ul>
                {product.details.map((detail, index) => (
                  <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>{detail}</Typography>
                ))}
              </ul>
            </Box>
          )}

          <Button component={RouterLink} to="/" variant="text" sx={{ mt: 2 }}>
            &larr; Continuar Comprando
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetailPage;