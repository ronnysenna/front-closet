// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductSearchBar from '../components/ProductSearchBar';
import RotatingBanner from '../components/RotatingBanner';
import ShippingInfo from '../components/ShippingInfo';
import { getAllProducts } from '../utils/api';

const HomePage = () => {
  const handleAutomacaoClick = () => {
    window.open('https://wa.me/5585991908723?text=Olá!%20Tenho%20interesse%20em%20soluções%20de%20automação%20ou%20criação%20de%20site.%20Gostaria%20de%20saber%20mais.', '_blank');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extrai apenas as URLs das imagens dos produtos
  const productImages = products
    .map(p => p.main_image)
    .filter(url => url); // Garante que apenas URLs válidas sejam passadas

  const whatsappGroupLink = "https://chat.whatsapp.com/Lm0FoBbvTSjD26lQSzjmY6";

  // Filtra produtos pelo termo de busca
  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Banner de automação/site no fundo */}
      <div style={{
  width: '100%',
  background: 'linear-gradient(90deg, #e91e63 0%, #f8bbd0 100%)',
  color: '#fff',
  padding: '8px 0',
  textAlign: 'center',
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 -2px 8px rgba(233,30,99,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  zIndex: 100,
      }}>
        <span style={{
          fontSize: '1rem',
          fontWeight: 500,
          maxWidth: '90vw',
          whiteSpace: 'pre-line',
          textAlign: 'center',
        }}>
          <span className="desktop-banner-text">Transforme seu negócio digital com automação ou site profissional. Fale com especialistas!</span>
          <span className="mobile-banner-text" style={{ display: 'none' }}>Automação ou site novo? Fale com especialistas!</span>
        </span>
      <style>
        {`
          @media (max-width: 600px) {
            .desktop-banner-text { display: none; }
            .mobile-banner-text { display: inline; }
          }
        `}
      </style>
        <button
          onClick={handleAutomacaoClick}
          style={{
            background: '#fff',
            color: '#e91e63',
            border: 'none',
            borderRadius: '20px',
            padding: '4px 18px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(233,30,99,0.12)',
            transition: 'background 0.2s',
          }}
        >
          Precisando de Site ou Automação?
        </button>
      </div>

      {/* Usando o componente RotatingBanner */}
      <RotatingBanner 
        images={productImages} 
        whatsappLink={whatsappGroupLink} 
      />

      {/* Barra de busca */}
      <ProductSearchBar onSearch={setSearchTerm} />

      {/* Lista de produtos filtrada */}
      {loading ? (
        <p>Carregando produtos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ProductList products={filteredProducts} />
      )}
      
      <ShippingInfo />
    </div>
  );
}

export default HomePage;