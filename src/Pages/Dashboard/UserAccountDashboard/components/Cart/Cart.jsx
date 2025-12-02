import { Store, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { Link } from "react-router";
import SelectAllCheckbox from "../../../../../components/ui/SelectAllCheckbox";
import useCart from "../../../../../Utils/Hooks/useCart";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../../Utils/Hooks/useAxiosSecure";
import { useState } from "react";
import DeleteAllBtn from "../../../../../components/ui/DeleteAllBtn";
import { HashLink } from "react-router-hash-link";

export default function Cart({ activeTab }) {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const axiosSecure = useAxiosSecure();
  const { carts, refetch } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  // ✅ handle single checkbox select/unselect
  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // ✅ handle select all for a single seller/cart
  const handleSelectAll = (cart) => {
    const productIds = cart.productinfo.map((p) => p.product_Id);
    const allSelected = productIds.every((id) => selectedItems.includes(id));

    setSelectedItems((prev) =>
      allSelected
        ? prev.filter((id) => !productIds.includes(id))
        : [...prev, ...productIds.filter((id) => !prev.includes(id))]
    );
  };

  // ✅ Global select all (সব কার্টের সব প্রোডাক্ট)
  const handleSelectAllGlobal = () => {
    const allProductIds = carts.flatMap((cart) =>
      cart.productinfo.map((p) => p.product_Id)
    );
    const allSelected = allProductIds.every((id) => selectedItems.includes(id));
    setSelectedItems(allSelected ? [] : allProductIds);
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) {
      return Swal.fire({
        icon: "info",
        title: "No items selected",
        text: "Please select items to delete.",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top",
      });
    }

    // 🔹 কনফার্মেশন
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All selected products will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00C853",
      cancelButtonColor: "#f72c2c",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete("/carts", {
          data: { ids: selectedItems },
        });

        if (res.data.updatedCount > 0 || res.data.deletedCount > 0) {
          setSelectedItems([]);
          refetch();
          return Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Selected products have been removed.",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top",
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Try Again!",
            toast: true,
            position: "top",
          });
        }

        // 🔹 কার্ট রিফ্রেশ এবং selectedItems রিসেট
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to delete selected products.",
          toast: true,
          position: "top",
        });
      }
    }
  };

  {
    /* filteredSelectedItems তৈরি করা হলো */
  }
  const filteredSelectedItems = carts
    .map((cart) => ({
      ...cart,
      productinfo: cart.productinfo.filter((item) =>
        selectedItems.includes(item.product_Id)
      ),
    }))
    // যেসব cart এ কিছুই select হয়নি, সেগুলো বাদ
    .filter((cart) => cart.productinfo.length > 0);

  console.log(filteredSelectedItems);

  const updateQty = async (cartId, productId, newQty) => {
    try {
      const res = await axiosSecure.patch("/carts/update-qty", {
        cartId,
        productId,
        newQty,
      });
      if (res.data.updatedCount > 0) {
        return refetch();
      }
    } catch (error) {
      console.error("Quantity update failed:", error);
    }
  };

  // ✅ Remove product (auto delete empty cart)
  const removeItem = async (cartId, productId) => {
    try {
      // 🔹 কনফার্মেশন ডায়ালগ দেখাও
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This product will be removed from your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#00C853",
        cancelButtonColor: "#f72c2c",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      // 🔹 ইউজার কনফার্ম করলে ডিলিট রিকোয়েস্ট পাঠাও
      if (result.isConfirmed) {
        const { data } = await axiosSecure.patch("/carts/remove-product", {
          cartId,
          productId,
        });

        if (data.deletedCount) {
          await Swal.fire({
            title: "Removed!",
            text: "Product has been removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top",
          });
          refetch();
        }
      }
    } catch (error) {
      console.error("Remove failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while removing the product.",
        icon: "error",
        toast: true,
        position: "top",
      });
    }
  };
  return (
    <div>
      {activeTab === "Cart" && (
        <div>
          <div className="space-y-4">
            {!carts.length ? (
              <div className="bg-white p-4 rounded-box shadow-sm my-4">
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  Cart Is Empty
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2 lg:col-span-2">
                  <div className="flex justify-between items-center gap-3  bg-white py-4 px-3 rounded">
                    <div className="flex gap-2 items-center">
                      <SelectAllCheckbox
                        allSelected={
                          carts
                            .flatMap((c) =>
                              c.productinfo.map((p) => p.product_Id)
                            )
                            .every((id) => selectedItems.includes(id)) &&
                          carts.length > 0
                        }
                        toggleSelectAll={handleSelectAllGlobal}
                        isShowCounter={false}
                      />
                      <h3>Select All Items</h3>
                    </div>
                    <DeleteAllBtn
                      selected={selectedItems}
                      bulkDelete={handleBulkDelete}
                    />
                  </div>
                  {carts.map((cart) => (
                    <div
                      key={cart.cartid}
                      className="py-5  bg-white rounded-2xl space-y-4 border border-gray-200"
                    >
                      <h3 className=" ms-8  flex items-center gap-4">
                        <div className="mb-0.5">
                          <SelectAllCheckbox
                            allSelected={cart.productinfo.every((item) =>
                              selectedItems.includes(item.product_Id)
                            )}
                            toggleSelectAll={() => handleSelectAll(cart)}
                            isShowCounter={false}
                          />
                        </div>

                        <HashLink
                          to={`/seller-page/${
                            cart.seller_store_name
                          }/store?id=${btoa(cart.sellerid)}#`}
                          className="flex gap-x-1.5 items-center  text-gray-500 hover:text-orange-400 "
                        >
                          <Store size={20} />
                          <span>{cart.seller_store_name}</span>
                        </HashLink>
                      </h3>

                      <hr class="border-t border-gray-200" />
                      {!carts.length ? (
                        <div className="h-screen flex items-center justify-center bg-white">
                          <h1 className="text-3xl text-gray-300">
                            Your Cart Is Empty
                          </h1>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4  px-5">
                          {cart.productinfo.map((item) => (
                            <motion.div
                              key={item.product_Id}
                              whileHover={{ scale: 1.01 }}
                              className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between relative "
                            >
                              <input
                                type="checkbox"
                                className="checkbox checkbox-secondary checkbox-xs rounded-sm absolute top-2 left-3"
                                checked={selectedItems.includes(
                                  item.product_Id
                                )}
                                onChange={() =>
                                  handleSelectItem(item.product_Id)
                                }
                              />

                              <div className="flex items-center gap-6 ms-4">
                                <img
                                  src={`${baseUrl}${item.product_img}`}
                                  alt={item.product_name}
                                  className="w-20 h-20 rounded-xl object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {item.product_name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[#FF0055] font-bold">
                                      {item.sale_price > 0 ? (
                                        <>
                                          ৳
                                          {item.sale_price.toLocaleString(
                                            "en-IN"
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {item.regular_price.toLocaleString(
                                            "en-IN"
                                          )}
                                        </>
                                      )}
                                    </p>
                                    {item.sale_price > 0 && (
                                      <p className="text-gray-400 line-through text-sm">
                                        ৳
                                        {item.regular_price.toLocaleString(
                                          "en-IN"
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <p className="text-xs text-gray-500">
                                      Brand: {item?.brand || "No Brand"}
                                    </p>

                                    <div className="flex gap-1.5">
                                      {Object.entries(item.variants)
                                        .filter(
                                          ([key]) =>
                                            ![
                                              "regular_price",
                                              "sale_price",
                                              "stock",
                                            ].includes(key)
                                        )
                                        .map(
                                          ([variant, value], index, array) => (
                                            <p
                                              className="text-xs text-gray-500"
                                              key={variant}
                                            >
                                              {variant}: {value}
                                              {index < array.length - 1 && ","}
                                            </p>
                                          )
                                        )}
                                    </div>
                                  </div>

                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-sm text-gray-600">
                                      Qty:
                                    </label>
                                    <div className="flex items-center border rounded-lg w-24">
                                      <button
                                        onClick={() =>
                                          updateQty(
                                            cart.cartid,
                                            item.product_Id,
                                            Math.max(1, item.qty - 1)
                                          )
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
                                            cart.cartid,
                                            item.product_Id,
                                            Math.max(1, Number(e.target.value))
                                          )
                                        }
                                        className="w-12 text-center outline-none border-none"
                                      />

                                      <button
                                        onClick={() =>
                                          updateQty(
                                            cart.cartid,
                                            item.product_Id,
                                            Math.max(1, item.qty + 1)
                                          )
                                        }
                                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-lg"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  removeItem(cart.cartid, item.product_Id)
                                }
                                className="text-gray-500 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 size={20} />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  {!filteredSelectedItems?.length ? (
                    <>
                      <button
                        disabled={"disabled"}
                        className="p-3  w-max rounded-md bg-gray-300 text-gray-500  border-none "
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/checkout"
                      state={{ items: filteredSelectedItems }}
                    >
                      <button className="p-3  w-max rounded-md bg-[#00C853] hover:bg-[#00B34A] text-white border-none cursor-pointer">
                        Proceed to Checkout
                      </button>
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
