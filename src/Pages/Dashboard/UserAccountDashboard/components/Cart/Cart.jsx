import { Trash2 } from "lucide-react";
import { Link } from "react-router";

export default function Cart({
  cart,
  cartTotal,
  activeTab,
  setActiveTab,
  updateCartQty,
  removeFromCart,
}) {
  return (
    <div>
      {activeTab === "Cart" && (
        <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-lg"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <div className="font-medium text-base sm:text-lg">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500">৳{item.price}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-left sm:text-right ">
                  <div className="font-semibold mt-2 sm:mt-0">
                    ৳{item.price * item.qty}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-600 mt-2 flex items-center gap-1 hover:text-red-800 transition"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">৳{cartTotal}</span>
          </div>

          <div className="mt-4 flex gap-3">
            <Link to="/checkout">
              <button className="btn sm:btn-md btn-sm rounded-md bg-[#00C853] hover:bg-[#00B34A] text-white border-none cursor-pointer">
                Proceed to Checkout
              </button>
            </Link>
            <button
              onClick={() => setActiveTab("Payments")}
              className="btn sm:btn-md btn-sm rounded-md btn-outline cursor-pointer"
            >
              Choose Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
