import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../../Utils/Hooks/useAxiosPublic";

export default function Wishlist({ activeTab, wishlist, refetch }) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const axiosPublic = useAxiosPublic();
  const removeItem = async (id) => {
    try {
      await axiosPublic.delete(`/wishlist/${id}`);
      Swal.fire({
        icon: "success",
        title: "Product Removed From Wishlist Successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      return refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
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
  console.log(wishlist);

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
                      key={item.wishlistid}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-lg"
                    >
                      <img
                        src={`${baseUrl}${item.img}`}
                        alt={item.productname}
                        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                      />

                      <div className="flex-1">
                        <div className="font-medium text-base sm:text-lg">
                          {item.productname}
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
                          onClick={() => removeItem(item.wishlistid)}
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
