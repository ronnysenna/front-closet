// src/components/ProductList.jsx
import React from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import { Grid, Typography, Container } from '@mui/material';

const ProductList = () => {
  if (!products || products.length === 0) {
    return <Typography variant="subtitle1" align="center" sx={{ mt: 5 }}>Nenhum produto encontrado.</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}> {/* py é padding no eixo Y */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Nossos Produtos
      </Typography>
      <Grid container spacing={3}> {/* spacing={3} equivale a 3*8px = 24px de espaçamento */}
        {products.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}> {/* Define responsividade */}
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;