/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    {
      sellerId: "442eb642-63ef-4115-830d-6db46ca9b0cd",
      name: "Wireless Headphones",
      price: 120,
      qty: 1,
      weight: 2,
      delivery_charge: 0,
    },
    {
      sellerId: "400d6143-27cb-4882-b163-ed5f48430e46",
      name: "Canvas Backpack",
      price: 65,
      qty: 2,
      weight: 2,
      delivery_charge: 0,
    },
  ]);
  const [appliedPromos, setAppliedPromos] = useState([]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (name) =>
    setCartItems((prev) => prev.filter((i) => i.name !== name));

  const updateQty = (name, qty) =>
    setCartItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, qty } : i))
    );
  const updateItem = (name, updates) =>
    setCartItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, ...updates } : i))
    );

  const cartInfo = {
    cartItems,
    addItem,
    removeItem,
    updateQty,
    updateItem,
    appliedPromos,
    setAppliedPromos,
  };

  return (
    <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>
  );
}
