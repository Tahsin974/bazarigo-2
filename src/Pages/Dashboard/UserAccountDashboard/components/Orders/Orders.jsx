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
                              <div className="flex flex-col gap-5">
                                <div
                                  key={item.product_Id}
                                  whileHover={{ scale: 1.01 }}
                                  className="bg-white shadow-md rounded-2xl p-6 flex items-center justify-between relative"
                                >
                                  <span
                                    className={`px-3 py-1 text-xs rounded-full absolute top-2 right-2 ${
                                      item.order_status === "Delivered"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {item.order_status}
                                  </span>

                                  <div className="flex items-center gap-6">
                                    <img
                                      src={`${baseUrl}${item.product_img}`}
                                      alt={item.product_name}
                                      className="w-20 h-20 rounded-xl object-cover"
                                    />
                                    <div>
                                      <h3 className="font-semibold text-gray-800 max-w-96">
                                        {item.product_name}
                                      </h3>
                                      <div className="flex items-center gap-2">
                                        <p className="text-[#FF0055] font-bold">
                                          {item.sale_price > 1 ? (
                                            <>
                                              ৳
                                              {item.sale_price.toLocaleString(
                                                "en-IN"
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              ৳
                                              {item.regular_price.toLocaleString(
                                                "en-IN"
                                              )}
                                            </>
                                          )}
                                        </p>
                                        {item.sale_price > 1 && (
                                          <span className="text-gray-400 line-through ">
                                            ৳
                                            {item.regular_price.toLocaleString(
                                              "en-IN"
                                            )}
                                          </span>
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
                                              (
                                                [variant, value],
                                                index,
                                                array
                                              ) => (
                                                <p
                                                  className="text-xs text-gray-500"
                                                  key={variant}
                                                >
                                                  {variant}: {value}
                                                  {index < array.length - 1 &&
                                                    ","}
                                                </p>
                                              )
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-xs text-gray-500 ms-auto">
                                    Qty: {item.qty}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-2 ">
                                    {steps.map((step, idx) => {
                                      const done =
                                        idx < getStepIndex(item.order_status);
                                      return (
                                        <div key={idx} className="text-center">
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
                                          (getStepIndex(item.order_status) /
                                            steps.length) *
                                          100
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                    <Truck size={16} />
                                    {order.status === "Delivered" ? (
                                      <span>Order successfully delivered!</span>
                                    ) : (
                                      <span>
                                        Current Status: {item.order_status}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-end mt-3">
                                    {item.order_status === "Shipped" ||
                                    item.order_status === "Out for Delivery" ||
                                    item.order_status === "Delivered" ? (
                                      <button
                                        className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none "
                                        disabled="disabled"
                                      >
                                        Cancel Order
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleCancelOrder(
                                            "Cancelled",
                                            item.product_Id,
                                            order.order_id
                                          )
                                        }
                                        className="px-3 py-2 rounded-md bg-[#f72c2c] hover:bg-[#e92323] text-white flex items-center gap-2  border-none shadow-none sm:text-base text-[14px] cursor-pointer"
                                      >
                                        Cancel Order
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
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
