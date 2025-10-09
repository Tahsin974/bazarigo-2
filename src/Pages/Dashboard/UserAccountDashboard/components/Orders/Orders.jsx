import { Truck } from "lucide-react";

export default function Orders({
  orders,
  activeTab,
  setActiveTab,
  setPrefillOrderId,
}) {
  return (
    <div>
      {activeTab === "Orders" && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white sm:p-6 p-3 rounded-2xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">Date: {order.date}</p>
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
                {order.products.map((prod) => (
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
                          setPrefillOrderId(order.id);
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
                <div className="flex items-center justify-between mb-2">
                  {order.steps.map((step, idx) => {
                    const done = idx < order.currentStep;
                    return (
                      <div key={idx} className="flex-1 text-center">
                        <div
                          className={`${
                            done
                              ? "bg-[#FF0055] text-white"
                              : "bg-gray-200 text-gray-500"
                          } w-8 h-8 mx-auto rounded-full flex items-center justify-center`}
                        >
                          {idx + 1}
                        </div>
                        <p
                          className={`${
                            done
                              ? "text-[#FF0055] font-medium"
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
                    className="absolute top-0 left-0 h-1 bg-[#FF0055] rounded-full"
                    style={{
                      width: `${
                        ((order.currentStep - 1) / (order.steps.length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Truck size={16} /> Tracking in progress...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
