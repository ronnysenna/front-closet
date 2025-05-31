// src/pages/HomePage.jsx
import React from 'react';
import ProductList from '../components/ProductList';

const HomePage = () => {
  return (
    <div>
      {/* Pode adicionar um Hero Banner aqui se desejar */}
      <section className="bg-pink-50 py-12 text-center">
          <div className="container-app mx-auto px-4">
              <h1 className="text-4xl font-bold text-brand-pink mb-4">Bem-vinda à Gofashion!</h1>
              <p className="text-lg text-gray-700">Seu estilo, sua moda. Encontre as melhores peças aqui.</p>
          </div>
      </section>
      <ProductList />
    </div>
  );
};

export default HomePage;