// src/components/ProductList.jsx
import React from 'react';
import ProductCard from './ProductCard';
import { Grid, Typography, Container } from '@mui/material';

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <Typography variant="subtitle1" align="center" sx={{ mt: 5 }}>Nenhum produto encontrado.</Typography>;
  }

  return (
    <Container sx={{ py: { xs: 2, md: 4 }, px: { xs: 0.5, sm: 2 } }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        sx={{
          mb: { xs: 2, md: 4 },
          fontWeight: 'bold',
          letterSpacing: '.08em',
          color: 'primary.main',
          textShadow: '0 2px 8px #f8bbd0',
          fontSize: { xs: '2rem', md: '2.5rem' },
        }}
      >
        <span style={{ color: '#e91e63', fontWeight: 700, fontSize: 'inherit' }}>Nossos Produtos</span><br />
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, sm: 3, md: 4 }}
        alignItems="stretch"
        justifyContent="center"
        sx={{
          width: '100%',
          margin: 0,
        }}
      >
        {products.map(product => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', px: { xs: 0, sm: 1 } }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;