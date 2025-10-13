import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import UseCart from "../../Utils/Hooks/UseCart";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import SelectField from "../../components/ui/SelectField";
import { useState } from "react";

export default function CheckOutPage() {
  const { cartItems } = UseCart();
  const navigate = useNavigate();
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  console.log(isCashOnDelivery);
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Billing Information</h2>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full px-4 py-3 border rounded-lg"
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
                  selectValue={""}
                  selectValueChange={(e) => console.log(e.target.value)}
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
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                  onChange={(e) => setIsCashOnDelivery(e.target.checked)}
                />{" "}
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
            className="w-full mt-6 bg-[#FF0055] text-white py-3 rounded-full hover:bg-[#e6004d] transition"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
