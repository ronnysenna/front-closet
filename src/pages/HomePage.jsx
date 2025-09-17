// src/pages/HomePage.jsx
/** biome-ignore-all assist/source/organizeImports: Importações organizadas manualmente para manter a ordem específica por relevância de componentes */
import react from "react";
import ProductList from "../components/ProductList";
import ProductSearchBar from "../components/ProductSearchBar";
import ShippingInfo from "../components/ShippingInfo";
import CategoryGrid from "../components/CategoryGrid";
import HighlightBanner from "../components/HighlightBanner";
import { getAllProducts } from "../utils/api";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = react.useState("");
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
        setError(
          "Não foi possível carregar os produtos. Por favor, tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtra produtos pelo termo de busca
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <HighlightBanner
        images={[
          "/image/capa1.png",
          "/image/capa2.png",
          "/image/capa4.png",
        ]}
        interval={10000}
      />
      {/* Pode adicionar um Hero Banner aqui se desejar */}
      <section className="bg-pink-50 py-12 text-center">
        <div className="container-app mx-auto px-4">
          <h1 className="text-4xl font-bold text-brand-pink mb-4" style={{ color: "#ff6923" }}> 
            Bem-vinda à Closet Moda Fitness!
          </h1>
          <p className="text-lg text-gray-700">
            Seu estilo, sua moda. Encontre as melhores peças aqui.
          </p>
        </div>
      </section>

      {/* Barra de busca */}
      <ProductSearchBar onSearch={setSearchTerm} />
      {/* Grid de Categorias */}
      <CategoryGrid />
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
};

export default HomePage;
