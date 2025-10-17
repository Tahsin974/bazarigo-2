import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UseCart from "../../Utils/Hooks/UseCart";

export default function OrderSummary({
  items,
  isCashOnDelivery,
  delivery = 10,
  allowPromo = false,
  showTitle = true,
  promoCodes = {
    SAVE10: { type: "flat", value: 10 },
    SAVE15: { type: "percent", value: 15 },
    FREESHIP: { type: "freeship" },
  },
}) {
  const { appliedPromos, setAppliedPromos } = UseCart();
  const [promo, setPromo] = useState("");

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const flatDiscounts = appliedPromos
    .filter((p) => p.type === "flat")
    .reduce((acc, p) => acc + p.value, 0);

  const percentDiscounts = appliedPromos
    .filter((p) => p.type === "percent")
    .reduce((acc, p) => acc + (subtotal * p.value) / 100, 0);

  const isFreeDelivery = appliedPromos.some((p) => p.type === "freeship");

  // Calculate shipping per product
  const deliveryPerItem = delivery * items.length;

  const totalDiscount = flatDiscounts + percentDiscounts;
  const effectiveDelivery = isFreeDelivery ? 0 : deliveryPerItem;
  const total = subtotal + effectiveDelivery - totalDiscount;

  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code || !promoCodes[code]) return setPromo("");
    if (appliedPromos.find((p) => p.code === code)) return setPromo("");
    setAppliedPromos([...appliedPromos, { code, ...promoCodes[code] }]);
    setPromo("");
  };

  const handleRemovePromo = (code) =>
    setAppliedPromos(appliedPromos.filter((p) => p.code !== code));

  return (
    <Card className="rounded-2xl shadow">
      <CardContent className="md:p-6 p-4 space-y-4 sm:text-base text-sm">
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        )}
        <div className="divide-y">
          <div className="pb-3">
            {items.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between py-3 text-gray-700">
                  <h2>
                    {item.name}{" "}
                    <span className="text-sm text-gray-500">(x{item.qty})</span>
                  </h2>
                  <h2>৳{(item.price * item.qty).toFixed(2)}</h2>
                </div>
                <div className="flex justify-between text-gray-600">
                  <h2>Delivery Charge</h2>
                  <h2>
                    {isFreeDelivery ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `৳ ${delivery.toFixed(2)}`
                    )}
                  </h2>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 mt-4">
              <h2>Subtotal</h2>
              <h2>৳{subtotal.toFixed(2)}</h2>
            </div>
            <div className="flex justify-between text-gray-600">
              <h2>Total Charges</h2>
              <h2>
                {isFreeDelivery ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `৳ ${deliveryPerItem.toFixed(2)}`
                )}
              </h2>
            </div>
          </div>
        </div>

        {isCashOnDelivery && (
          <div className="flex justify-between text-gray-600">
            <span>Cash On Delivery</span>
          </div>
        )}

        {appliedPromos.length > 0 && (
          <div className="space-y-2">
            {appliedPromos.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between text-green-600 font-medium"
              >
                <span>
                  {p.code}{" "}
                  {p.type === "flat"
                    ? `($${p.value} off)`
                    : p.type === "percent"
                    ? `(${p.value}% off)`
                    : "(Free delivery)"}
                </span>
                <button
                  onClick={() => handleRemovePromo(p.code)}
                  className="text-xs text-red-500 hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-800 sm:text-lg text-base border-t pt-4">
          <h2>Total</h2>
          <h2>৳{total.toFixed(2)}</h2>
        </div>
        {allowPromo && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none w-full sm:w-auto"
              />
              <Button
                onClick={handleApplyPromo}
                className="bg-[#00C853] text-white px-4 py-2 rounded-md hover:bg-[#00B34A] transition "
              >
                Apply
              </Button>
            </div>
            {/* {Object.keys(promoCodes).length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Try codes:{" "}
                {Object.entries(promoCodes).map(
                  ([code, { type, value }], idx) => (
                    <span key={idx} className="font-semibold mr-3">
                      {code}{" "}
                      {type === "flat"
                        ? `($${value} off)`
                        : type === "percent"
                        ? `(${value}% off)`
                        : "(Free Shipping)"}
                    </span>
                  )
                )}
              </p>
            )} */}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
