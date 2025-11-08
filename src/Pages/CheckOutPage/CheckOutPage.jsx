import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SelectField from "../../components/ui/SelectField";
import { useState } from "react";
import bKash from "../../assets/payments/bkash.png";
import Rocket from "../../assets/payments/rocket.jpeg";
import Nagad from "../../assets/payments/nagad.png";
import UseCart from "../../Utils/Hooks/UseCart";
import axios from "axios";
import useNewCart from "../../Utils/Hooks/useNewCart";
import { HandCoins, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useLocation } from "react-router";

export default function CheckOutPage() {
  const { cartItems, appliedPromos, setAppliedPromos } = UseCart();
  const { refetch } = useNewCart();

  const location = useLocation();
  const items = location.state.items;

  const checkoutItems = items;
  console.log(checkoutItems);
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");

  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

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

  const HandleOrderBtn = async (e) => {
    e.preventDefault();
    const form = e.target;
    // const customerName = form.name.value;
    // const customerAddress = form.address.value;
    const customerNumber = form.number.value;
    const payment = {
      transactionId: "TXN-" + Date.now(),
      payment_date: new Date().toISOString(),
      amount: total,
      payment_method: isCashOnDelivery ? "Cash On Delivery" : provider,
      phoneNumber: isCashOnDelivery ? "" : customerNumber,
      isCashOnDelivery,
    };

    const paymentRes = await axios.post(
      "http://localhost:3000/payments",
      payment
    );

    if (paymentRes.data.createdCount > 0) {
      navigate("/thank-you");
    }
  };

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
  function getEstimatedDelivery(orderDateStr, timeStr) {
    const orderDate = new Date(orderDateStr);
    orderDate.setDate(orderDate.getDate() + 3);
    let minDays = 0;
    let maxDays = 0;

    const match = timeStr.match(/(\d+)-(\d+)/);
    if (match) {
      // minDays = parseInt(match[1], 10);
      maxDays = parseInt(match[2], 10);
    } else {
      // যদি শুধু এক দিন থাকে "1 day"
      const singleMatch = timeStr.match(/(\d+)/);
      if (singleMatch) {
        // minDays = parseInt(singleMatch[1], 10);
        maxDays = minDays;
      }
    }

    console.log(minDays, maxDays);

    const minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + minDays);

    const maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + maxDays);

    const options = { month: "short", day: "numeric" };
    return `${minDate.toLocaleDateString(
      "en-US",
      options
    )} – ${maxDate.toLocaleDateString("en-US", options)}`;
  }
  return (
    <div className="bg-[#f7f7f8] ">
      {!checkoutItems.length ? (
        <div className="h-screen">
          <h1>Loading....</h1>
        </div>
      ) : (
        <div className="container mx-auto xl:px-6 lg:px-6  px-2 py-16 ">
          <h1 className="text-3xl font-bold text-gray-600 mb-8">Checkout</h1>
          <form
            onSubmit={HandleOrderBtn}
            className="flex  lg:flex-row flex-col gap-10"
          >
            <div className="flex-1 space-y-6">
              <Card className="rounded-2xl shadow-md bg-white">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Billing Information</h2>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    className="w-full px-4 py-3 border rounded-lg focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    className="w-full px-4 py-3 border rounded-lg focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md bg-white">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                  <div className="space-y-2">
                    <SelectField
                      selectValue={provider}
                      selectValueChange={(e) => setProvider(e.target.value)}
                      isWide={true}
                    >
                      <option value="" disabled>
                        Select Provider
                      </option>
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                    </SelectField>
                    <input
                      placeholder="Phone Number"
                      name="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
                    />
                    {/* --- bKash Instructions --- */}
                    {provider === "bKash" && (
                      <Card className="rounded-2xl shadow ">
                        <CardContent className="sm:p-6 p-2 space-y-4 ">
                          <div className="bg-pink-50 border border-[#FF0055] text-gray-700 rounded-xl p-4 shadow-sm relative ">
                            <h3 className="font-semibold text-[#FF0055] mb-1">
                              বিকাশে পেমেন্ট করার নিয়ম 💸
                            </h3>
                            <ol className="list-decimal list-inside space-y-1 text-base leading-relaxed">
                              <li>আপনার মোবাইলে বিকাশ অ্যাপটি খুলুন।</li>
                              <li>
                                <strong>“Send Money”</strong> অপশনটি নির্বাচন
                                করুন।
                              </li>
                              <li>
                                আমাদের বিকাশ নম্বর লিখুন:
                                <strong>01741-899559</strong>।
                              </li>
                              <li>
                                মোট টাকার পরিমাণ লিখুন (স্ক্রিনে প্রদর্শিত
                                পরিমাণ অনুযায়ী)।
                              </li>
                              <li>
                                “Reference” ঘরে আপনার অর্ডার নম্বর বা ফোন নম্বর
                                লিখুন।
                              </li>
                              <li>
                                <strong>Confirm</strong> বাটনে চাপ দিন পেমেন্ট
                                সম্পন্ন করতে।
                              </li>
                            </ol>
                            {/* <p className="text-base text-gray-600 mt-2"> পেমেন্ট সম্পন্ন করার পর নিচের  <strong>“পেমেন্ট নিশ্চিত করুন”</strong> বাটনে ক্লিক করুন। </p> */}
                            <figure>
                              <img
                                src={bKash}
                                alt="bKash"
                                className="  h-20 top-2 right-2 absolute md:flex hidden xl:flex lg:hidden"
                              />
                            </figure>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* --- Rocket Instructions --- */}
                    {provider === "Rocket" && (
                      <Card className="rounded-2xl shadow">
                        <CardContent className="sm:p-6 p-2 space-y-4">
                          <div className="bg-purple-50 border border-purple-500 text-gray-700 rounded-xl p-4 shadow-sm relative">
                            <h3 className="font-semibold text-purple-600 mb-1">
                              রকেটে পেমেন্ট করার নিয়ম 🚀
                            </h3>
                            <ol className="list-decimal list-inside space-y-1 text-base leading-relaxed">
                              <li>
                                আপনার মোবাইলে রকেট অ্যাপ বা *322# ডায়াল করুন।
                              </li>
                              <li>
                                <strong>“Send Money”</strong> অপশন নির্বাচন
                                করুন।
                              </li>
                              <li>
                                আমাদের রকেট নম্বর লিখুন:
                                <strong>01797-454118</strong>।
                              </li>
                              <li>
                                টাকার পরিমাণ লিখুন (স্ক্রিনে প্রদর্শিত পরিমাণ
                                অনুযায়ী)।
                              </li>
                              <li>“Reference” ঘরে আপনার অর্ডার নম্বর লিখুন।</li>
                              <li>আপনার পিন দিয়ে পেমেন্ট সম্পন্ন করুন।</li>
                            </ol>
                            {/* <p className="text-sm text-gray-600 mt-2"> পেমেন্ট সম্পন্ন হলে নিচের  <strong>“পেমেন্ট নিশ্চিত করুন”</strong> বাটনে ক্লিক করুন। </p> */}
                            <figure>
                              <img
                                src={Rocket}
                                alt="rocket"
                                className="  h-20 top-2 right-2 absolute md:flex hidden xl:flex lg:hidden"
                              />
                            </figure>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* --- Nagad Instructions --- */}
                    {provider === "Nagad" && (
                      <Card className="rounded-2xl shadow">
                        <CardContent className="sm:p-6 p-2  space-y-4">
                          <div className="bg-yellow-50 border border-yellow-400 text-gray-700 rounded-xl p-4 shadow-sm relative">
                            <h3 className="font-semibold text-yellow-600 mb-1">
                              নগদে পেমেন্ট করার নিয়ম 💰
                            </h3>
                            <ol className="list-decimal list-inside space-y-1 text-base leading-relaxed">
                              <li>
                                আপনার মোবাইলে নগদ অ্যাপ বা *167# ডায়াল করুন।
                              </li>
                              <li>
                                <strong>“Send Money”</strong> অপশন নির্বাচন
                                করুন।
                              </li>
                              <li>
                                আমাদের নগদ নম্বর লিখুন:
                                <strong>01797-454118</strong>।
                              </li>
                              <li>মোট টাকার পরিমাণ লিখুন।</li>
                              <li>“Reference” ঘরে আপনার অর্ডার নম্বর লিখুন।</li>
                              <li>আপনার পিন দিয়ে পেমেন্ট সম্পন্ন করুন।</li>
                            </ol>
                            {/* <p className="text-sm text-gray-600 mt-2"> পেমেন্ট সম্পন্ন হলে নিচের  <strong>“পেমেন্ট নিশ্চিত করুন”</strong> বাটনে ক্লিক করুন। </p> */}
                            <figure>
                              <img
                                src={Nagad}
                                alt="nagad"
                                className="  h-20 top-2 right-2 absolute md:flex hidden xl:flex lg:hidden"
                              />
                            </figure>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      onChange={(e) => {
                        setIsCashOnDelivery(e.target.checked);
                        refetch();
                      }}
                    />
                    Cash On Delivery
                  </label>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-5 lg:col-span-2">
                {checkoutItems.map((checkoutItem) => (
                  <div
                    key={checkoutItem.cartid}
                    className="py-5  bg-white rounded-2xl space-y-4"
                  >
                    <div className="border border-[#FF0055] p-5 w-max me-auto rounded-2xl mx-5">
                      <div>
                        <div className="flex flex-col gap-4">
                          {checkoutItem.deliveries.total_delivery_charge ===
                          0 ? (
                            <>
                              <div className="flex gap-2 justify-center">
                                <HandCoins className="text-green-500" />
                                <span className="text-green-500  font-semibold">
                                  Free Delivery
                                </span>
                              </div>
                              <span className="text-gray-800 font-semibold">
                                Estimated Delivery :{" "}
                                {getEstimatedDelivery(
                                  new Date().toISOString(),
                                  checkoutItem.deliveries.delivery_time
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="flex gap-2 justify-center">
                                <HandCoins className="text-green-500" />
                                <span className="text-gray-800  font-semibold">
                                  Delivery Charge ৳
                                  {
                                    checkoutItem.deliveries
                                      .total_delivery_charge
                                  }
                                </span>
                              </div>
                              <span className="text-gray-800 font-semibold">
                                Estimated Delivery :{" "}
                                {getEstimatedDelivery(
                                  new Date().toISOString(),
                                  checkoutItem.deliveries.delivery_time
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <hr class="border-t border-gray-200" />
                    {!checkoutItems.length ? (
                      <div className="h-screen flex items-center justify-center ">
                        <h1 className="text-3xl text-gray-300">
                          Your Cart Is Empty
                        </h1>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4  px-5">
                        {checkoutItem.productinfo.map((item) => (
                          <motion.div
                            key={item.product_Id}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between "
                          >
                            <div className="flex items-center gap-6">
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
                                      {item.regular_price.toLocaleString(
                                        "en-IN"
                                      )}
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
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(checkoutItem.cartid, item.product_Id)
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
            </div>

            <div>
              <OrderSummary
                isCashOnDelivery={isCashOnDelivery}
                items={checkoutItems}
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
                setIsCashOnDelivery={setIsCashOnDelivery}
              />
              {!checkoutItems.length ? (
                <Button
                  disabled={"disabled"}
                  className="w-full mt-6 bg-gray-300 text-gray-500  py-3 rounded-full transition "
                >
                  Place Order
                </Button>
              ) : (
                <Button className="w-full mt-6 bg-[#00C853] text-white py-3 rounded-full hover:bg-[#00B34A] transition">
                  Place Order
                </Button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

{
  /* <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="px-4 py-3 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="px-4 py-3 border rounded-lg"
                />
              </div>
            </CardContent>
          </Card> */
}
