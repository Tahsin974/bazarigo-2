import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import UseCart from "../../Utils/Hooks/UseCart";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SelectField from "../../components/ui/SelectField";
import { useState } from "react";
import bKash from "../../assets/payments/bkash.png";
import Rocket from "../../assets/payments/rocket.jpeg";
import Nagad from "../../assets/payments/nagad.png";

export default function CheckOutPage() {
  const { cartItems } = UseCart();
  const navigate = useNavigate();
  const [provider, setProvider] = useState("");

  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  return (
    <div className="container mx-auto xl:px-6 lg:px-6  px-2 py-16 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="flex  lg:flex-row flex-col gap-10">
        <div className="flex-1 space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Billing Information</h2>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-3 border rounded-lg focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
              />
            </CardContent>
          </Card>
          {/* <Card className="rounded-2xl shadow-md">
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
          </Card> */}

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
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
                            <strong>“Send Money”</strong> অপশনটি নির্বাচন করুন।
                          </li>
                          <li>
                            আমাদের বিকাশ নম্বর লিখুন:
                            <strong>01741-899559</strong>।
                          </li>
                          <li>
                            মোট টাকার পরিমাণ লিখুন (স্ক্রিনে প্রদর্শিত পরিমাণ
                            অনুযায়ী)।
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
                          <li>আপনার মোবাইলে রকেট অ্যাপ বা *322# ডায়াল করুন।</li>
                          <li>
                            <strong>“Send Money”</strong> অপশন নির্বাচন করুন।
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
                          <li>আপনার মোবাইলে নগদ অ্যাপ বা *167# ডায়াল করুন।</li>
                          <li>
                            <strong>“Send Money”</strong> অপশন নির্বাচন করুন।
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
                  onChange={(e) => setIsCashOnDelivery(e.target.checked)}
                />
                Cash On Delivery
              </label>
            </CardContent>
          </Card>
        </div>
        <div>
          <OrderSummary
            isCashOnDelivery={isCashOnDelivery}
            items={cartItems}
            allowPromo={true}
          />
          <Button
            onClick={() => navigate("/thank-you")}
            className="w-full mt-6 bg-[#00C853] text-white py-3 rounded-full hover:bg-[#00B34A] transition"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
