import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../../../Utils/Hooks/useAuth";
import useCart from "../../../../../Utils/Hooks/useCart";

export default function Wishlist({ activeTab, wishlist, refetch }) {
  const { user } = useAuth();
  const { refetch: refetchCart } = useCart();
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

  const moveToCart = async (item) => {
    const res = await axiosPublic.get(`/products/${item.product_id}`);
    const product = res.data.product;
    try {
      const cartItem = {
        product_Id: item.product_id,
        product_name: item.product_name,
        sale_price: item.sale_price,
        product_img: item.img,
        product_category: item.product_category,
        regular_price: item.regular_price,
        variants: item.variants,
        weight: item.weight,
        brand: item.brand || "No Brand",
        qty: item.qty,
      };

      const deliveryPayload = {
        sellerId: product.seller_id,

        userId: user.id,
        weight: parseInt(item.weight || 0), // ensure number
        orderAmount:
          item.sale_price === 0 ? item.regular_price : item.sale_price, // single item price
        isCod: false, // বা তোমার state অনুযায়ী
      };

      // === Step 1: Delivery fetch ===
      const deliveryRes = await axiosPublic.get("/deliveries", {
        params: deliveryPayload,
      });

      const deliveries = deliveryRes.data.result[0] || {};

      // === Step 2: Prepare cart payload with delivery info ===
      const payLoad = {
        sellerId: product.seller_id,

        productInfo: [cartItem],
        deliveries, // attach delivery info
      };

      // === Step 3: Add to cart API call ===
      const res = await axiosPublic.post(
        `/carts?email=${user?.email}`,
        payLoad
      );

      if (res.data.createdCount > 0 || res.data.updatedCount > 0) {
        const deleteRes = await axiosPublic.delete(
          `/wishlist/${item.wishlist_id}`
        );
        if (deleteRes.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Product Added To Cart Successfully",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
          refetch();
          refetchCart();
          return;
        }
      }
    } catch (err) {
      return Swal.fire({
        icon: "error",
        title: `${err.response.data.message}`,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
    }
  };

  console.log(wishlist);
  return (
    <div>
      {activeTab === "Wishlist" && (
        <div className="min-h-screen bg-white md:py-10 py-6 xl:px-6 lg:px-6 md:px-6 sm:px-6 px-4 flex justify-center">
          <div className="w-full max-w-5xl">
            <Card className="xl:px-6 lg:px-6 md:px-6 sm:px-6 px-4 py-6 bg-white  shadow">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 capitalize">
                  Your wishlist is empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlist.map((item) => (
                    <div
                      key={item.wishlistid}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border p-3 rounded-lg"
                    >
                      <img
                        src={`${baseUrl}${item.img}`}
                        alt={item.product_name}
                        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded"
                      />

                      <div className="flex-1">
                        <span className="font-semibold text-base sm:text-lg">
                          {item.product_name}
                        </span>
                        <div className="text-sm text-[#FF0055]">
                          ৳
                          {item.sale_price > 0 ? (
                            <>৳{item.sale_price.toLocaleString("en-IN")}</>
                          ) : (
                            <>{item.regular_price.toLocaleString("en-IN")}</>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col flex-row gap-2 items-center sm:justify-center justify-between">
                        <button
                          onClick={() => moveToCart(item)}
                          className="bg-gray-200  hover:bg-gray-300 text-gray-600  px-4 py-2 rounded-full shadow-md   flex items-center justify-center sm:text-sm text-xs"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeItem(item.wishlist_id)}
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
