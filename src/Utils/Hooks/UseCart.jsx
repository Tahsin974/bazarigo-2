import React, { useContext } from "react";
import { CartContext } from "../../Provider/CartProvider";

export default function UseCart() {
  return useContext(CartContext);
}
