// src/pages/CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import { getProductsByCategorySlug } from '../utils/api';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategorySlug(category);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar produtos por categoria:", err);
        setError("Não foi possível carregar os produtos desta categoria.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductsByCategory();
  }, [category]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '2rem 0', fontWeight: 'bold', fontSize: '2rem' }}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h2>
      
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Carregando produtos...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</p>
      ) : products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Nenhum produto encontrado nesta categoria.</p>
      )}
    </div>
  );
};

export default CategoryPage;
