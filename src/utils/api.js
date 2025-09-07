// api.js - Arquivo para centralizar as chamadas da API
import { API_BASE_URL } from "../config.js";
const BASE_URL = API_BASE_URL; // URL da API definida no arquivo config.js

// Função para obter um novo token de acesso usando o refresh token
const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Nenhum refresh token disponível");
    }

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Falha ao renovar o token");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data.token;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    // Limpa os tokens se a renovação falhar
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

// Função genérica para fazer requisições
const fetchData = async (endpoint, options = {}) => {
  try {
    // Adiciona o token de autenticação se ele existir
    const token = localStorage.getItem("authToken");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    // Se o token expirou (401), tenta renovar e refazer a requisição
    if (response.status === 401) {
      try {
        const newToken = await refreshAuthToken();
        // Refaz a requisição com o novo token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! Status: ${retryResponse.status}`);
        }
        return await retryResponse.json();
      } catch (_refreshError) {
        // Se a renovação falhar, redireciona para login
        window.location.href = "/login";
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
    }

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
export const getAllProducts = () => fetchData("/products");

export const getProductById = (id) => fetchData(`/products/id/${id}`);

export const getProductBySlug = (slug) => fetchData(`/products/${slug}`);

// CRUD para produtos
export const createProduct = (productData) =>
  fetchData("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

export const updateProduct = (id, productData) =>
  fetchData(`/products/id/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

export const deleteProduct = (id) =>
  fetchData(`/products/id/${id}`, {
    method: "DELETE",
  });

export const getCategories = () => fetchData("/categories");

export const getCategoryById = (id) => fetchData(`/categories/id/${id}`);

export const getCategoryBySlug = (slug) =>
  fetchData(`/categories/slug/${slug}`);

// CRUD para categorias
export const createCategory = (categoryData) =>
  fetchData("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

export const updateCategory = (id, categoryData) =>
  fetchData(`/categories/id/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

export const deleteCategory = (id) =>
  fetchData(`/categories/id/${id}`, {
    method: "DELETE",
  });

export const getProductsByCategory = (categoryId) =>
  fetchData(`/products/category/id/${categoryId}`);

export const getProductsByCategorySlug = (slug) =>
  fetchData(`/products/category/${slug}`);

export const searchProducts = async (query) => {
  try {
    // Usar a query string para buscar no servidor
    const response = await fetch(
      `${BASE_URL}/products?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    // Fallback para busca local se o servidor não tiver endpoint de busca
    const products = await getAllProducts();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Funções de autenticação e usuário
export const loginUser = async (email, password) => {
  try {
    console.log(`Tentando login na URL: ${BASE_URL}/auth/login`);
    console.log(`Credenciais: ${email}`);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Incluir cookies na requisição
    });

    console.log(`Resposta da API: Status ${response.status}`);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error("Detalhes do erro:", errorData);
      } catch (e) {
        console.error("Não foi possível ler o corpo da resposta de erro");
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Login bem-sucedido, dados recebidos:", {
      ...data,
      token: "***",
    });

    // Armazena os tokens JWT no localStorage
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log(`Tentando registrar usuário na URL: ${BASE_URL}/auth/register`);

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log(`Resposta da API de registro: Status ${response.status}`);

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error("Detalhes do erro de registro:", errorData);
      } catch (e) {
        console.error("Não foi possível ler o corpo da resposta de erro");
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Registro bem-sucedido, usuário criado:", {
      ...data,
      user: { ...data.user, password: "***" },
    });

    return data;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
};

export const getUserProfile = async () => {
  return fetchData("/auth/profile");
};

export const updateUserProfile = async (userData) => {
  return fetchData("/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

// Função para buscar estatísticas do dashboard
export const getDashboardStats = async () => {
  return fetchData("/dashboard/stats");
};

// Funções para pedidos e carrinho
export const createOrder = async (orderData) => {
  return fetchData("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
};

export const getOrders = async () => {
  return fetchData("/orders");
};

export const getMyOrders = async () => {
  return fetchData("/orders/my-orders");
};

export const getOrderById = async (orderId) => {
  return fetchData(`/orders/${orderId}`);
};

export const updateOrderStatus = async (orderId, statusData) => {
  return fetchData(`/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(statusData),
  });
};

// Atualizar observações do pedido
export const updateOrderNotes = async (orderId, notes) => {
  return fetchData(`/orders/${orderId}/notes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });
};

// Atualizar método de pagamento do pedido
export const updateOrderPaymentMethod = async (orderId, paymentData) => {
  return fetchData(`/orders/${orderId}/payment-method`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });
};

// Atualizar número de rastreamento do pedido
export const updateOrderTracking = async (orderId, trackingNumber) => {
  return fetchData(`/orders/${orderId}/tracking`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trackingNumber }),
  });
};

// Buscar pedido pelo número
export const getOrderByNumber = async (orderNumber) => {
  return fetchData(`/orders/number/${orderNumber}`);
};

// Cancelar pedido
export const cancelOrder = async (orderId) => {
  return fetchData(`/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Funções para produtos em destaque
export const getFeaturedProducts = () => fetchData("/products/featured");

// Função para upload de imagens de produtos
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const token = localStorage.getItem("authToken");

    // Não podemos adicionar o header Content-Type quando usamos FormData
    // O navegador configurará automaticamente com o boundary correto
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/upload/product-image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
};

export default {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getProductsByCategory,
  getProductsByCategorySlug,
  searchProducts,
  getFeaturedProducts,
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getDashboardStats,
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderNotes,
  updateOrderPaymentMethod,
  updateOrderTracking,
  getOrderByNumber,
  cancelOrder,
  uploadProductImage,
};
