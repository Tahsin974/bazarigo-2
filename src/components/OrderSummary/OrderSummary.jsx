import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

export default function OrderSummary({
  appliedPromos,
  setAppliedPromos,
  items,
  isCashOnDelivery,

  allowPromo = false,
  showTitle = true,
  promoCodes = {
    SAVE10: { type: "flat", value: 10 },
    SAVE15: { type: "percent", value: 15 },
    FREESHIP: { type: "freeship" },
  },
  promo,
  setPromo,
  isFreeDelivery,
  refetch,
}) {
  const userId = "cd2528e8-4725-4c10-aac7-f7824d7ce1bb";

  const subtotal = items.reduce((cartSum, item) => {
    const itemTotal = item.productinfo.reduce(
      (sum, prod) => sum + prod.qty * prod.sale_price,
      0
    );
    return cartSum + itemTotal;
  }, 0);

  const newSubtotal = items.map((item) => {
    const itemTotal = item.productinfo.reduce(
      (sum, prod) => sum + prod.qty * prod.sale_price,
      0
    );
    return itemTotal;
  });
  console.log("new Subtotal", newSubtotal);
  const deliveryPerItem = items.reduce(
    (sum, item) => sum + item.deliveries.total_delivery_charge,
    0
  );
  const total = subtotal + deliveryPerItem;

  useEffect(() => {}, []);
  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code || !promoCodes[code]) return setPromo("");
    if (appliedPromos.find((p) => p.code === code)) return setPromo("");
    setAppliedPromos([...appliedPromos, { code, ...promoCodes[code] }]);
    setPromo("");
  };

  const handleRemovePromo = (code) =>
    setAppliedPromos(appliedPromos.filter((p) => p.code !== code));
  useEffect(() => {
    const fetchAndUpdateDelivery = async () => {
      try {
        const updatedItems = await Promise.all(
          items.map(async (item) => {
            // seller এর total weight
            const totalWeight = item.productinfo.reduce(
              (sum, prod) => sum + (parseFloat(prod.weight) || 0),
              0
            );
            const newSubtotal = item.productinfo.reduce(
              (sum, prod) => sum + prod.qty * prod.sale_price,
              0
            );

            // Delivery API call
            const res = await axios.get("http://localhost:3000/deliveries", {
              params: {
                sellerId: item.sellerid,
                userId,
                weight: totalWeight,
                orderAmount: newSubtotal,
                isCod: isCashOnDelivery,
              },
            });

            const deliveries = res.data.result[0] || {};

            // Backend update call
            await axios.patch("http://localhost:3000/carts", {
              cartId: item.cartid,
              deliveries,
            });

            return { ...item, deliveries };
          })
        );

        console.log("items updated with deliveries:", updatedItems);
        // যদি state রাখতে চাও
        // setItemsWithDeliveries(updatedItems);
      } catch (err) {
        console.error("Error fetching or updating deliveries:", err);
      }
    };

    fetchAndUpdateDelivery();
    refetch();
  }, [isCashOnDelivery]);

  console.log(items);

  return (
    <Card className="rounded-2xl shadow bg-white">
      <CardContent className="md:p-6 p-4 space-y-4 sm:text-base text-sm">
        {showTitle && (
          <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
        )}
        <div className="divide-y">
          <div className="pb-3">
            {items.map((item) => (
              <div key={item.cartid}>
                {item.productinfo.map((prod) => (
                  <div
                    key={prod.product_Id}
                    className="flex justify-between py-3 text-gray-700"
                  >
                    <h2>
                      {prod.product_name || "Empty"}{" "}
                      <span className="text-sm text-gray-500">
                        {prod.qty > 1 && <span>(x{prod.qty})</span>}
                      </span>
                    </h2>
                    <h2>
                      ৳
                      {(prod.sale_price * prod.qty || 0).toLocaleString(
                        "en-IN"
                      )}
                    </h2>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 mt-4">
              <h2>Subtotal</h2>
              <h2>৳{subtotal.toLocaleString("en-IN") || 0}</h2>
            </div>
            <div className="flex justify-between text-gray-600">
              <h2>Delivery Charges</h2>
              <h2>
                {isFreeDelivery ? (
                  <span className="text-green-600 font-medium">Free</span>
                ) : (
                  `৳ ${deliveryPerItem || 0}`
                )}
              </h2>
            </div>
          </div>
        </div>

        {isCashOnDelivery && (
          <div className="flex justify-center text-gray-600">
            <h2>Cash On Delivery</h2>
          </div>
        )}

        {appliedPromos?.length > 0 && (
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
                  className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white "
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-800 sm:text-lg text-base border-t pt-4">
          <h2>Total</h2>
          <h2>৳{total.toLocaleString("en-IN") || 0}</h2>
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
                className="bg-[#00C853] text-white px-4 py-2 rounded-md hover:bg-[#00B34A] transition cursor-pointer"
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
