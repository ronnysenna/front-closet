// api.js - Arquivo para centralizar as chamadas da API
const BASE_URL = "https://closetmodafitness.com/api";

// Função genérica para fazer requisições
const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    throw error;
  }
};

// Funções específicas para cada tipo de dados
export const getAllProducts = () => fetchData("/products/read.php");

export const getProductById = (id) =>
  fetchData(`/products/read_one.php?id=${id}`);

export const getProductBySlug = (slug) =>
  fetchData(`/products/read_one.php?slug=${slug}`);

export const getCategories = () => fetchData("/categories/read.php");

export const getProductsByCategory = (categoryId) =>
  fetchData(`/products/by_category.php?id=${categoryId}`);

export const getProductsByCategorySlug = (slug) =>
  fetchData(`/products/by_category.php?slug=${slug}`);

export const searchProducts = async (query) => {
  // Busca todos os produtos e filtra no cliente
  // Em uma implementação real, isso seria feito no servidor
  const products = await getAllProducts();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
  );
};

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getProductsByCategory,
  getProductsByCategorySlug,
  searchProducts,
};
