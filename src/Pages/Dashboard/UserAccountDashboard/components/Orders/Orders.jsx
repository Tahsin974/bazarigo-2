import { Store, Truck } from "lucide-react";

import { HashLink } from "react-router-hash-link";
import useAxiosPublic from "../../../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useEstimatedDelivery from "../../../../../Utils/Helpers/useEstimatedDelivery";
import FormattedDate from "../../../../../Utils/Helpers/FormattedDate";

export default function Orders({ orders, activeTab, refetch }) {
  const getEstimatedDelivery = useEstimatedDelivery;
  const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
  // Maps order status to a numeric step for progress calculation
  const axiosPublic = useAxiosPublic();

  const getStepIndex = (status) => {
    switch (status) {
      case "Processing":
        return 0.15;
      case "Shipped":
        return 1.35;
      case "Out for Delivery":
        return 2.65;
      case "Delivered":
        return 4;
      default:
        return 0;
    }
  };
  const handleCancelOrder = async (status, prodId, orderId) => {
    const res = await axiosPublic.patch(`/orders/status/${orderId}`, {
      order_status: status,
      prodId,
    });
    if (res.data.updatedCount > 0 || res.data.deletedCount > 0) {
      Swal.fire({
        icon: "success",
        title: "Order Cancelled Succesfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch();
      return window.location.reload();
    }
  };
  const baseUrl = import.meta.env.VITE_BASEURL;

  return (
    <div>
      {activeTab === "Orders" && (
        <div className="space-y-6">
          <h3 className="font-medium sm:text-base text-[14px] mb-3">
            Total Orders{" "}
            {!orders?.length ? (
              ""
            ) : (
              <>({orders.length.toLocaleString("en-IN")})</>
            )}
          </h3>
          {!orders.length ? (
            <div className="bg-white p-4 rounded-box shadow-sm my-4">
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                You haven’t placed any orders yet.
              </div>
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="bg-white sm:p-6 p-3 rounded-2xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold">
                        Order ID:{order.order_id}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Order Date: {FormattedDate(order.order_date)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {order.order_items.map((item) => (
                      <div className="grid grid-cols-1 gap-5 lg:col-span-2">
                        <div
                          key={item.cartid}
                          className="  bg-white rounded-2xl space-y-4"
                        >
                          <h3>
                            <HashLink
                              to={`/seller-page/${
                                item.seller_store_name
                              }/store?id=${btoa(item.sellerid)}#`}
                              className="flex gap-x-1.5 items-center my-1 text-gray-500 hover:text-orange-400 "
                            >
                              <Store size={20} />
                              <span>{item.seller_store_name}</span>
                            </HashLink>
                          </h3>
                          <div>
                            <p className="text-lg text-gray-500 mt-2 font-bold">
                              Est. Delivery:{" "}
                              {getEstimatedDelivery(
                                new Date().toLocaleString("en-CA", {
                                  timeZone: "Asia/Dhaka",
                                  hour12: false,
                                }),
                                item.deliveries.delivery_time
                              )}
                            </p>
                          </div>

                          <hr class="border-t border-gray-200" />

                          <div className="grid grid-cols-1 gap-4  px-5">
                            {item.productinfo.map((item) => (
                              <>
                                <div className="flex flex-col gap-6">
                                  {/* Product Card */}

                                  <div
                                    key={item.product_Id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm
             p-4 sm:p-5 lg:p-6
             flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6
             overflow-hidden"
                                  >
                                    {/* Left: Image + Info */}
                                    <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
                                      {/* Image (fixed box) */}
                                      <figure className=" shrink-0 aspect-[1/1] sm:aspect-none ">
                                        <img
                                          src={`${baseUrl}${item.product_img}`}
                                          alt={item.product_name}
                                          className="w-full h-full sm:w-20 sm:h-20 rounded-xl object-cover border"
                                        />
                                      </figure>

                                      {/* Content */}
                                      <div className="flex flex-col gap-1.5 min-w-0">
                                        {/* Title */}
                                        <h3 className="font-semibold text-gray-800  text-sm sm:text-base leading-snug break-words">
                                          {item.product_name}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-[#FF0055] font-bold text-sm sm:text-base">
                                            ৳
                                            {(item.sale_price > 1
                                              ? item.sale_price
                                              : item.regular_price
                                            ).toLocaleString("en-IN")}
                                          </span>

                                          {item.sale_price > 1 && (
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                              ৳
                                              {item.regular_price.toLocaleString(
                                                "en-IN"
                                              )}
                                            </span>
                                          )}
                                        </div>

                                        {/* Meta */}
                                        <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5 break-words">
                                          <span>
                                            Brand: {item?.brand || "No Brand"}
                                          </span>

                                          {Object.entries(item.variants || {})
                                            .filter(
                                              ([key]) =>
                                                ![
                                                  "regular_price",
                                                  "sale_price",
                                                  "stock",
                                                  "id",
                                                ].includes(key)
                                            )
                                            .map(([variant, value]) => (
                                              <span key={variant}>
                                                {variant}: {value}
                                              </span>
                                            ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Qty */}
                                    <div className="text-xs sm:text-sm text-gray-500 lg:text-right shrink-0">
                                      Qty:
                                      <span className="ml-1 font-medium text-gray-700">
                                        {item.qty}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Order Status */}
                                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border">
                                    {/* Steps */}
                                    <div className="flex justify-between mb-3">
                                      {steps.map((step, idx) => {
                                        const done =
                                          idx <=
                                          getStepIndex(item.order_status);
                                        return (
                                          <div
                                            key={idx}
                                            className="flex-1 text-center"
                                          >
                                            <div
                                              className={`mx-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                                done
                                                  ? "bg-green-500 text-white"
                                                  : "bg-gray-200 text-gray-500"
                                              }`}
                                            >
                                              {idx + 1}
                                            </div>
                                            <p
                                              className={`mt-1 text-[9px] sm:text-xs ${
                                                done
                                                  ? "text-green-600"
                                                  : "text-gray-400"
                                              }`}
                                            >
                                              {step}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="absolute left-0 top-0 h-full bg-green-500"
                                        style={{
                                          width: `${
                                            (getStepIndex(item.order_status) /
                                              (steps.length - 1)) *
                                            100
                                          }%`,
                                        }}
                                      />
                                    </div>

                                    {/* Status Text */}
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-3">
                                      <Truck size={14} />
                                      {item.order_status === "Delivered" ? (
                                        <span className="text-green-600 font-medium">
                                          Order successfully delivered
                                        </span>
                                      ) : (
                                        <span>
                                          Current status:{" "}
                                          <span className="font-medium">
                                            {item.order_status}
                                          </span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Action */}
                                    <div className="flex sm:justify-end justify-center mt-4">
                                      <button
                                        disabled={[
                                          "Shipped",
                                          "Out for Delivery",
                                          "Delivered",
                                        ].includes(item.order_status)}
                                        onClick={() =>
                                          handleCancelOrder(
                                            "Cancelled",
                                            item.product_Id,
                                            order.order_id
                                          )
                                        }
                                        className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                      >
                                        Cancel Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
