import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts } from '../utils/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar produtos em destaque:', err);
        setError('Não foi possível carregar os produtos em destaque. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Produtos em Destaque
      </Typography>
      
      {products.length === 0 ? (
        <Typography variant="body1">Nenhum produto em destaque disponível no momento.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FeaturedProducts;
