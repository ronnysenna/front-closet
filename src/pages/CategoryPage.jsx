// src/pages/CategoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { products } from '../data/products';

const CategoryPage = () => {
  const { category } = useParams();
  // Filtra produtos pela categoria
  const filteredProducts = products.filter(p => p.category === category);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '2rem 0', fontWeight: 'bold', fontSize: '2rem' }}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default CategoryPage;
