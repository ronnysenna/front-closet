
// src/pages/HomePage.jsx
import React from 'react';
import ProductList from '../components/ProductList';
import ProductSearchBar from '../components/ProductSearchBar';
import RotatingBanner from '../components/RotatingBanner';
import ShippingInfo from '../components/ShippingInfo';
import { products } from '../data/products';

import { useState } from 'react';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Extrai apenas as URLs das imagens dos produtos
  // Ajusta o caminho da imagem: remove '../public/' para funcionar corretamente
  const productImages = products
    .map(p => p.imageUrl.replace('../public/', '/'))
    .filter(url => url); // Garante que apenas URLs válidas sejam passadas

  const whatsappGroupLink = "https://chat.whatsapp.com/Lm0FoBbvTSjD26lQSzjmY6";

  // Filtra produtos pelo termo de busca
  const filteredProducts = products.filter(
    p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Pode adicionar um Hero Banner aqui se desejar */}
      <section className="bg-pink-50 py-12 text-center">
        <div className="container-app mx-auto px-4">
          <h1 className="text-4xl font-bold text-brand-pink mb-4">Bem-vinda à Gofashion!</h1>
          <p className="text-lg text-gray-700">Seu estilo, sua moda. Encontre as melhores peças aqui.</p>
        </div>
      </section>

      {/* Usando o componente RotatingBanner */}
      <RotatingBanner 
        images={productImages} 
        whatsappLink={whatsappGroupLink} 
      />

      {/* Barra de busca */}
      <ProductSearchBar onSearch={setSearchTerm} />

      {/* Lista de produtos filtrada */}
      <ProductList products={filteredProducts} />
      {/* Barra de busca */}
      <ProductSearchBar onSearch={setSearchTerm} />
      <ShippingInfo />
    </div>
  );
}

export default HomePage;