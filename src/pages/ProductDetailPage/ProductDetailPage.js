import React from "react";
import { useParams, Link } from "react-router-dom";
import toast from 'react-hot-toast';
// import './ProductDetailPage.css'; // Removi o comentário se o arquivo existir

const ProductDetailPage = ({ allProducts, addToCart }) => {
  // --- CORREÇÃO 1: Usar 'id' do useParams ---
  const { id } = useParams();

  // Verificação de Segurança (com typo corrigido)
  // --- CORREÇÃO 3: Remover hífen de all-Products ---
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    console.error("ProductDetailPage: Prop 'allProducts' não é um array válido ou está vazia:", allProducts); // Corrigido aqui
    return (
      <div className="container" style={{ padding: "50px 0", textAlign: "center" }}>
        <h2>Carregando dados do produto...</h2>
        <p>Se esta mensagem persistir, pode haver um problema ao carregar os produtos.</p>
      </div>
    );
  }

  // Encontrar o produto usando 'id'
  // --- CORREÇÃO 2: Usar 'id' na comparação ---
  const product = allProducts.find(p => p.id.toString() === id);

  // Lidar com produto não encontrado (usando 'id')
  if (!product) {
    console.warn("ProductDetailPage: Produto com ID", id, "não encontrado no array."); // Corrigido aqui
    return (
      <div className="container" style={{ padding: "50px 0", textAlign: "center" }}>
        <h2>Produto não encontrado!</h2>
        <p>O produto com ID ({id}) que você está procurando não existe em nossa base.</p> {/* Corrigido aqui */}
        <Link to="/">Voltar para a Home</Link>
      </div>
    );
  }

  // Função para chamar addToCart (sem alterações, mas verificada)
  const handleAddToCart = () => {
    if (typeof addToCart === 'function') {
        addToCart(product);
    } else {
        console.error("ProductDetailPage: Prop 'addToCart' não é uma função!");
        toast.error("Erro ao tentar adicionar ao carrinho.");
    }
  };

  // Renderizar detalhes (sem alterações funcionais, mas revisado)
  return (
    <section className="product-detail-page" style={{ padding: "40px 0" }}>
       {/* Seu JSX de renderização aqui... igual ao que você já tinha */}
       {/* ... imagem, nome, preço, descrição, botão ... */}
        {/* Exemplo Mínimo: */}
        <div style={{border: '1px solid red', padding: '10px'}}> {/* Div de exemplo */}
            <h1>{product.name}</h1>
            <p>ID: {product.id}</p>
            <p>Preço: R$ {product.price}</p>
            <button onClick={handleAddToCart}>Adicionar ao Carrinho</button>
        </div>
    </section>
  );
};

export default ProductDetailPage;