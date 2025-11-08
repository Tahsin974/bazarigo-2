import { motion } from "framer-motion";
import { Store, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { Link, useNavigate } from "react-router";
import UseCart from "../../Utils/Hooks/UseCart";
import { useState } from "react";
import useNewCart from "../../Utils/Hooks/useNewCart";
import { HashLink } from "react-router-hash-link";
import axios from "axios";
import SelectAllCheckbox from "../../components/ui/SelectAllCheckbox";
import Swal from "sweetalert2";
import DeleteAllBtn from "../../components/ui/DeleteAllBtn";

export default function CartPage() {
  const { cartItems, appliedPromos, setAppliedPromos } = UseCart();
  const { carts, refetch } = useNewCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

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
    console.log(allProductIds);
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
        const res = await axios.delete("http://localhost:3000/carts", {
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
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Try Again!",
          });
        }

        // 🔹 কার্ট রিফ্রেশ এবং selectedItems রিসেট
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to delete selected products.",
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

  const handleCheckoutBtn = () => {
    navigate("/checkout", { state: { items: filteredSelectedItems } });
  };

  const [promo, setPromo] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const flatDiscounts = appliedPromos
    .filter((p) => p.type === "flat")
    .reduce((acc, p) => acc + p.value, 0);

  const percentDiscounts = appliedPromos
    .filter((p) => p.type === "percent")
    .reduce((acc, p) => acc + (subtotal * p.value) / 100, 0);

  const isFreeDelivery = appliedPromos.some((p) => p.type === "freeship");

  // Calculate shipping per product
  const deliveryPerItem = cartItems.reduce(
    (acc, item) => acc + item.delivery_charge,
    0
  );

  const totalDiscount = flatDiscounts + percentDiscounts;
  const effectiveDelivery = isFreeDelivery ? 0 : deliveryPerItem;
  const total = subtotal + effectiveDelivery - totalDiscount;
  const updateQty = async (cartId, productId, newQty) => {
    try {
      const res = await axios.patch("http://localhost:3000/carts/update-qty", {
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
        const { data } = await axios.patch(
          "http://localhost:3000/carts/remove-product",
          { cartId, productId }
        );

        if (data.deletedCount) {
          await Swal.fire({
            title: "Removed!",
            text: "Product has been removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
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
      });
    }
  };

  console.log("From Cart Page", carts);

  return (
    <div className=" bg-[#f7f7f8]">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4 py-16 space-y-5">
        <h1 className="text-3xl font-bold text-gray-600 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {!carts.length ? (
            <div className="h-screen flex items-center justify-center lg:col-span-2 bg-white">
              <h3 className="tetx-2xl text-gray-400">Cart Is Empty</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:col-span-2">
              <div className="flex justify-between items-center gap-3  bg-white py-4 px-3 rounded">
                <div className="flex gap-2 items-center">
                  <SelectAllCheckbox
                    allSelected={
                      carts
                        .flatMap((c) => c.productinfo.map((p) => p.product_Id))
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
                  className="py-5 relative bg-white rounded-2xl space-y-4"
                >
                  <div className="top-2 left-3 absolute">
                    <SelectAllCheckbox
                      allSelected={cart.productinfo.every((item) =>
                        selectedItems.includes(item.product_Id)
                      )}
                      toggleSelectAll={() => handleSelectAll(cart)}
                      isShowCounter={false}
                    />
                  </div>
                  <h3 className=" ms-10 mt-5">
                    <HashLink
                      to={`/seller-page/${cart.seller_store_name}/store#`}
                      className="flex gap-x-1.5 items-center my-1 text-gray-500 hover:text-orange-400 "
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
                            checked={selectedItems.includes(item.product_Id)}
                            onChange={() => handleSelectItem(item.product_Id)}
                          />

                          <div className="flex items-center gap-6 ms-4">
                            <img
                              src={`http://localhost:3000${item.product_img}`}
                              alt={item.product_name}
                              className="w-20 h-20 rounded-xl object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.product_name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <p className="text-[#FF0055] font-bold">
                                  ৳{item.sale_price.toLocaleString("en-IN")}
                                </p>
                                {item.regular_price > 1 && (
                                  <p className="text-gray-400 line-through text-sm">
                                    ৳
                                    {item.regular_price.toLocaleString("en-IN")}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1.5">
                                <p className="text-xs text-gray-500">
                                  Brand: {item.brand} ,
                                </p>
                                {Object.entries(item.variants).map(
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
          )}
          <div>
            <OrderSummary
              items={filteredSelectedItems}
              allowPromo={true}
              promo={promo}
              setPromo={setPromo}
              isFreeDelivery={isFreeDelivery}
              subtotal={subtotal}
              deliveryPerItem={deliveryPerItem}
              total={total}
              appliedPromos={appliedPromos}
              setAppliedPromos={setAppliedPromos}
              refetch={refetch}
            />

            {!filteredSelectedItems.length ? (
              <Button
                disabled={"disabled"}
                className="w-full mt-6 bg-gray-300 text-gray-500  py-3 rounded-full transition "
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Button
                onClick={handleCheckoutBtn}
                className="w-full mt-6 bg-[#00C853] text-white py-3 rounded-full hover:bg-[#00B34A] transition cursor-pointer"
              >
                Proceed to Checkout
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
