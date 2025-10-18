import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { Link } from "react-router";
import UseCart from "../../Utils/Hooks/UseCart";

export default function CartPage() {
  const { cartItems, updateQty, removeItem } = UseCart();
  return (
    <div className="container mx-auto xl:px-6 lg:px-6  px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <img
                  src={`https://placehold.co/100x100/FF0055/ffffff?text=${item.name}`}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-[#FF0055] font-bold">
                    ৳{item.price.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-600">Qty:</label>
                    <div className="flex items-center border rounded-lg w-24">
                      <button
                        onClick={() =>
                          updateQty(item.name, Math.max(1, item.qty - 1))
                        }
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-lg"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(
                            item.name,
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        className="w-12 text-center outline-none border-none"
                      />

                      <button
                        onClick={() => updateQty(item.name, item.qty + 1)}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.name)}
                className="text-gray-500 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>
        <div>
          <OrderSummary items={cartItems} allowPromo={true} />
          <Link to="/checkout">
            <Button className="w-full mt-6 bg-[#00C853] text-white py-3 rounded-full hover:bg-[#00B34A] transition">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
