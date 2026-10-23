import { useState, useEffect } from "react";

import { CartContext } from "./CartContext";

function CartProvider({ children }) {
  // L'état
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("lessentiel-cart");

      if (!savedCart) return [];

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch {
      return [];
    }
  });

  // Sauvegarde dans local storage
  useEffect(() => {
    localStorage.setItem("lessentiel-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fonction d'ajout au panier
  function addToCart(product) {
    if (product.stock <= 0) return;

    setCartItems((currentItems) => {
      const existingProduct = currentItems.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  item.stock ?? product.stock ?? Infinity,
                ),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }

  function updateQuantity(id, quantity) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(Math.max(1, quantity), item.stock ?? Infinity),
            }
          : item,
      ),
    );
  }

  function syncProductInCart(product) {
    setCartItems((currentItems) => {
      const productIndex = currentItems.findIndex(
        (item) => String(item.id) === String(product.id),
      );

      if (productIndex === -1) return currentItems;

      const stock = Number(product.stock);

      if (!Number.isFinite(stock) || stock <= 0) {
        return currentItems.filter(
          (item) => String(item.id) !== String(product.id),
        );
      }

      return currentItems.map((item) => {
        if (String(item.id) !== String(product.id)) return item;

        return {
          ...item,
          title: product.title,
          price: Number(product.price),
          thumbnail:
            product.thumbnail ?? product.images?.[0] ?? item.thumbnail,
          stock,
          quantity: Math.min(Math.max(1, Number(item.quantity) || 1), stock),
        };
      });
    });
  }

  // Le provider
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        syncProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
