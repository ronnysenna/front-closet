// src/pages/ProductDetailPage.jsx

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById, getProductBySlug } from '../utils/api';

function ProductDetailPage() {
  const { id: productId } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Busca o produto na API
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verifica se o ID é numérico ou slug
        const isNumeric = !Number.isNaN(Number(productId));

        let productData;
        if (isNumeric) {
          productData = await getProductById(productId);
        } else {
          productData = await getProductBySlug(productId);
        }

        if (productData && !productData.message) {
          // Verifica se não é uma mensagem de erro da API
          setProduct(productData);

          // Define a imagem principal
          setMainImage(
            productData.main_image ||
              (productData.images && productData.images.length > 0
                ? productData.images[0].url
                : null)
          );

          // Define valores padrão para tamanho
          const defaultSizes = ['P', 'M', 'G'];
          const sizes = Array.isArray(productData.sizes) ? productData.sizes : defaultSizes;
          setSelectedSize(sizes.length > 0 ? sizes[0] : 'P');

          // Define valores padrão para cor
          const defaultColors = ['Preto', 'Branco', 'Rosa'];
          const colors = Array.isArray(productData.colors) ? productData.colors : defaultColors;
          setSelectedColor(colors.length > 0 ? colors[0] : 'Preto');
        } else {
          setError('Produto não encontrado.');
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Não foi possível carregar o produto. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, 1, selectedSize, selectedColor);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      // Poderia adicionar um feedback mais explícito se tamanho/cor não selecionados
      console.warn('Selecione tamanho e cor antes de adicionar ao carrinho.');
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
          <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3, mb: 2 }}>
            <img
              src={mainImage || 'https://via.placeholder.com/600x800?text=Imagem+Indisponível'}
              alt={product.title}
              style={{
                width: '100%',
                height: '260px',
                objectFit: 'contain',
                display: 'block',
                background: '#fafafa',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800?text=Imagem+Indisponível';
              }}
            />
          </Box>
          {/* Galeria de imagens */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            {(product.images || [product.main_image]).map((img, idx) => (
              <Box
                key={`img-thumb-${product.id}-${idx}`}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: 1,
                  width: 64,
                  height: 64,
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  border:
                    mainImage === (typeof img === 'string' ? img : img.url)
                      ? '2px solid #1976d2'
                      : '2px solid #eee',
                }}
                onClick={() => setMainImage(typeof img === 'string' ? img : img.url)}
              >
                <img
                  src={
                    (typeof img === 'string' ? img : img.url) ||
                    'https://via.placeholder.com/64x64?text=+'
                  }
                  alt={typeof img === 'object' && img.alt ? img.alt : `Miniatura ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {product.name || product.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
            {product.description || product.short_description || 'Sem descrição disponível'}
          </Typography>

          {product.categories && product.categories.length > 0 && (
            <Typography variant="overline" display="block" color="text.secondary" gutterBottom>
              Categoria: {product.categories.map((cat) => cat.name || cat).join(', ')}
            </Typography>
          )}

          <FormControl fullWidth sx={{ my: 2 }} disabled={product.stock === 0}>
            <InputLabel id={`size-label-detail-${product.id}`}>Tamanho</InputLabel>
            <Select
              labelId={`size-label-detail-${product.id}`}
              value={selectedSize}
              label="Tamanho"
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {(Array.isArray(product.sizes) ? product.sizes : ['P', 'M', 'G']).map((size) => (
                <MenuItem key={`size-${size}`} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} disabled={product.stock_quantity === 0}>
            <InputLabel id={`color-label-detail-${product.id}`}>Cor</InputLabel>
            <Select
              labelId={`color-label-detail-${product.id}`}
              value={selectedColor}
              label="Cor"
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {(Array.isArray(product.colors) ? product.colors : ['Preto', 'Branco', 'Rosa']).map(
                (color) => (
                  <MenuItem key={`color-${color}`} value={color}>
                    {color}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {`R$ ${product.price}`}
            </Typography>
            {product.stock > 0 ? (
              <Chip label={`Em estoque: ${product.stock}`} color="success" variant="outlined" />
            ) : (
              <Chip label="Esgotado" color="error" variant="outlined" />
            )}
          </Box> */}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color={added ? 'success' : 'primary'}
              startIcon={added ? <CheckCircleIcon /> : <ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || added || !selectedSize || !selectedColor}
              sx={{ py: 1.5, fontWeight: 'bold', minWidth: 180 }}
            >
              {added ? 'Adicionado ao Carrinho!' : 'Adicionar ao Carrinho'}
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic', fontWeight: 500 }}
            >
              Solicite as estampas disponíveis
            </Typography>
          </Box>

          {product.details && product.details.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Mais Detalhes:
              </Typography>
              <ul>
                {product.details.map((detail, index) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={`detail-${index}-${detail.substring(0, 10)}`}
                    sx={{ mb: 0.5 }}
                  >
                    {detail}
                  </Typography>
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
