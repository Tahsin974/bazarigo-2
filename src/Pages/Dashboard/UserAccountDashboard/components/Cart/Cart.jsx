import { Trash2 } from "lucide-react";

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
      {activeTab === "cart" && (
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border p-3 rounded-lg items-center"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">৳{item.price}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">৳{item.price * item.qty}</div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-600 mt-2 flex items-center gap-1"
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
            <button className="px-4 py-2 rounded-md bg-[#FF0055] text-white">
              Proceed to Checkout
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className="px-4 py-2 rounded-md border"
            >
              Choose Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
