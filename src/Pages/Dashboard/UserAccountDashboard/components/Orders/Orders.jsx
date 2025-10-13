import { Truck } from "lucide-react";
import FormattedDate from "../../../../../Utils/Hooks/FormattedDate";

export default function Orders({
  orders,
  activeTab,
  setActiveTab,
  setPrefillOrderId,
}) {
  const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
  // Maps order status to a numeric step for progress calculation
  const filteredOrders = orders.filter(
    (order) => order.customerEmail === "charlie@example.com"
  );
  const getStepIndex = (status) => {
    switch (status) {
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Out for Delivery":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div>
      {activeTab === "Orders" && (
        <div className="space-y-6">
          {filteredOrders.map((order, idx) => (
            <div
              key={order.orderId}
              className="bg-white sm:p-6 p-3 rounded-2xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">Order #{idx + 1}</h3>
                  <p className="text-sm text-gray-500">
                    Date: {FormattedDate(order.date)}
                  </p>
                  <p className="text-lg text-gray-500 mt-2 font-bold">
                    Est. Delivery: Thu, Oct 15 – Sun, Oct 18
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {order.items.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex gap-3 border p-3 rounded-lg items-center justify-between"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium sm:text-base text-sm">
                          {prod.name}
                        </div>
                        <div className="sm:text-sm text-xs text-gray-500">
                          ৳{prod.price}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        className="px-3 py-1 bg-[#FF0055] text-white rounded-md text-xs"
                        onClick={() => {
                          setPrefillOrderId(order.orderId);
                          setActiveTab("returns");
                        }}
                      >
                        Return
                      </button>
                      <div className="text-xs text-gray-500">Qty: 1</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking timeline */}
              <div>
                <div className="flex items-center justify-between mb-2 ">
                  {steps.map((step, idx) => {
                    const done = idx < getStepIndex(order.status);
                    return (
                      <div key={idx} className="flex-1 text-center">
                        <div
                          className={`${
                            done
                              ? "bg-[#22C55E] text-white"
                              : "bg-gray-200 text-gray-500"
                          } w-8 h-8 mx-auto rounded-full flex items-center justify-center`}
                        >
                          {idx + 1}
                        </div>
                        <p
                          className={`${
                            done
                              ? "text-[#22C55E] font-medium"
                              : "text-gray-400"
                          } sm:text-xs text-[8px] mt-1`}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="relative w-full h-1 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-1  rounded-full bg-[#22C55E]"
                    style={{
                      width: `${
                        (getStepIndex(order.status) / steps.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Truck size={16} />
                  {order.status === "Delivered" ? (
                    <span>Order successfully delivered!</span>
                  ) : (
                    <span>Current Status: {order.status}</span>
                  )}
                </div>
                <div className="flex justify-end">
                  {order.status === "Shipped" ? (
                    <button
                      className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none "
                      disabled="disabled"
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <button className="px-3 py-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center gap-2  border-none shadow-none sm:text-base text-xs cursor-pointer">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
