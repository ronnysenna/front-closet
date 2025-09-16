// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("gofashionCart");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem("gofashionCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedSize, selectedColor) => {
    const stockQuantity = product.stock_quantity ?? product.stockQuantity ?? 0;

    if (stockQuantity === 0) {
      return false;
    }

    setCartItems((prevItems) => {
      const itemExists = prevItems.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      // Se o item já existe, verificar se a nova quantidade não excede o estoque
      if (itemExists) {
        const newQuantity = itemExists.quantity + quantity;
        if (newQuantity > stockQuantity) {
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      // Se é um item novo, verificar se a quantidade inicial não excede o estoque
      if (quantity > stockQuantity) {
        return prevItems;
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity,
          selectedSize,
          selectedColor,
          cartItemId: `${product.id}-${selectedSize}-${selectedColor}`,
          stock: stockQuantity,
        },
      ];
    });

    return true;
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return true;
    }

    // Verificar se a nova quantidade não excede o estoque
    const item = cartItems.find((item) => item.cartItemId === cartItemId);
    if (item) {
      const stockQuantity =
        item.stock_quantity ?? item.stockQuantity ?? item.stock ?? 0;
      if (newQuantity > stockQuantity) {
        return false;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      return true;
    }
    return false;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
