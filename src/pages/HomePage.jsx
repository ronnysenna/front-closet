// src/pages/HomePage.jsx
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import react from 'react';
import ProductList from '../components/ProductList';
import ProductSearchBar from '../components/ProductSearchBar';
import RotatingBanner from '../components/RotatingBanner';
import ShippingInfo from '../components/ShippingInfo';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryGrid from '../components/CategoryGrid';
import { getAllProducts } from '../utils/api';

const HomePage = () => {
  const handleAutomacaoClick = () => {
    window.open('https://wa.me/5585991904540?text=Olá!%20Tenho%20interesse%20em%20soluções%20de%20automação%20ou%20criação%20de%20site.%20Gostaria%20de%20saber%20mais.', '_blank');
  };

  const [searchTerm, setSearchTerm] = react.useState('');
  const [products, setProducts] = react.useState([]);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState(null);

  // Busca produtos da API
  react.useEffect(() => {
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

  const whatsappGroupLink = "https://chat.whatsapp.com/";

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
          <h1 className="text-4xl font-bold text-brand-pink mb-4">Bem-vinda à Closet Moda Fitness!</h1>
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

      {/* Grid de Categorias */}
      <CategoryGrid />

      {/* Produtos em Destaque */}
      <FeaturedProducts />
      
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