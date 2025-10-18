import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function Wishlist({ activeTab, wishlist, setWishlist }) {
  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (id) => {
    const product = wishlist.find((item) => item.id === id);
    removeItem(id);
    Swal.fire({
      icon: "success",
      title: `${product.name} has been moved to the cart successfully`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div>
      {activeTab === "Wishlist" && (
        <div className="min-h-screen bg-white py-10 xl:px-6 lg:px-6 md:px-6 sm:px-6 px-4 flex justify-center">
          <div className="w-full max-w-5xl">
            <Card className="xl:px-6 lg:px-6 md:px-6 sm:px-6 px-4 py-6 bg-white  shadow-lg">
              <h2 className="text-2xl font-bold text-[#FF0055] mb-6">
                My Wishlist
              </h2>

              {wishlist.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Your wishlist is empty.
                </p>
              ) : (
                <div className="space-y-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-lg"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                      />

                      <div className="flex-1">
                        <div className="font-medium text-base sm:text-lg">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ৳{item.price}
                        </div>
                      </div>

                      <div className="flex sm:flex-col flex-row gap-2 items-center sm:justify-center justify-between">
                        <button
                          onClick={() => moveToCart(item.id)}
                          className="bg-gray-200  hover:bg-gray-300 text-gray-600  px-4 py-2 rounded-full shadow-md   flex items-center justify-center sm:text-sm text-xs"
                        >
                          Move to Cart
                        </button>
                        <button
                          // onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-600 mt-2 flex items-center gap-1 hover:text-red-800 "
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
