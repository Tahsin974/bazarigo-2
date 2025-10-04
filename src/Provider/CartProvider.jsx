/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([
    { name: "Wireless Headphones", price: 120, qty: 1 },
    { name: "Canvas Backpack", price: 65, qty: 2 },
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
  const cartInfo = {
    cartItems,
    addItem,
    removeItem,
    updateQty,
    appliedPromos,
    setAppliedPromos,
  };

  return (
    <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>
  );
}
