import { ChevronDown, DollarSign } from "lucide-react";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAuth from "../../../../Utils/Hooks/useAuth";

export default function ProductItemsSection({
  items,
  PRIMARY_COLOR,
  date,
  orderId,
  refetch,
  onClose,
  refetchReturnOrders,
}) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const baseURL = import.meta.env.VITE_BASEURL;
  const productsWithDelivery = items?.flatMap((item) => {
    return item.productinfo.map((prod) => ({
      ...prod,
      cart_id: item.cart_id,
      delivery_time: item.deliveries.delivery_time,
    }));
  });

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

    const minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + minDays);

    const maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + maxDays);

    const options = { month: "short", day: "numeric" };
    return `${minDate.toLocaleDateString(
      "en-US",
      options,
    )} – ${maxDate.toLocaleDateString("en-US", options)}`;
  }

  const setOrderStatus = async (status, prodId) => {
    const res = await axiosPublic.patch(`/orders/status/${orderId}`, {
      order_status: status,
      prodId,
    });
    if (res.data.updatedCount > 0) {
      Swal.fire({
        icon: "success",
        title: res.data.message,
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      });
      refetch();
      refetchReturnOrders();
      return onClose();
    }
  };

  const renderStatus = (selectValue) => {
    let colorClass = `"bg-white border border-gray-300 text-gray-900 disabled:text-gray-400 hover:border-gray-400"
  }     focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055]"`;
    switch (selectValue) {
      case "Delivered":
        colorClass = "bg-green-100 border-green-400 text-green-700";
        break;
      case "Shipped":
      case "Out for Delivery":
        colorClass = "bg-blue-100 border-blue-400 text-blue-700";
        break;
      case "Processing":
        colorClass = "bg-yellow-100 border-yellow-400 text-yellow-700";
        break;

      default:
        // default is used for "Processing" or initial state
        break;
    }

    return colorClass;
  };
  const isAdmin = user?.role === "admin" || user?.role === "super admin";

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border overflow-x-auto"
      style={{ borderColor: PRIMARY_COLOR }}
    >
      <h3
        className="text-xl font-bold p-6 text-gray-800 flex items-center border-b border-gray-200 justify-center sm:justify-start"
        style={{ color: PRIMARY_COLOR }}
      >
        <DollarSign size={20} className="mr-2" /> Product Details
      </h3>
      <div className="w-full bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm text-center">
            <thead className="text-black bg-gray-100">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Est. Delivery</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Order Status</th>
                {isAdmin && <th className="py-3 px-4">Action</th>}
              </tr>
            </thead>
            <tbody>
              {productsWithDelivery.map((prod, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-4 text-left">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      {prod.product_img ? (
                        <img
                          src={`${baseURL}${prod.product_img}`}
                          alt={prod.product_name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                          {prod.product_name}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prod.variants &&
                            !Array.isArray(prod.variants) &&
                            Object.entries(prod.variants)
                              .filter(
                                ([key]) =>
                                  ![
                                    "id",
                                    "regular_price",
                                    "sale_price",
                                    "stock",
                                  ].includes(key),
                              )
                              .map(([key, value], idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs border rounded bg-gray-100 text-gray-700"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                          {Array.isArray(prod.variants) &&
                            prod.variants.map((variant, vidx) =>
                              Object.entries(variant)
                                .filter(
                                  ([key]) =>
                                    !["id", "price", "stock"].includes(key),
                                )
                                .map(([key, value], idx) => (
                                  <span
                                    key={`${vidx}-${idx}`}
                                    className="px-2 py-1 text-xs border rounded bg-gray-100 text-gray-700"
                                  >
                                    {key}: {value}
                                  </span>
                                )),
                            )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">{prod?.brand || "No Brand"}</td>
                  <td className="px-4">{prod.qty}</td>
                  <td className="px-4 whitespace-nowrap">
                    {getEstimatedDelivery
                      ? getEstimatedDelivery(date, prod.delivery_time)
                      : prod.delivery_time}
                  </td>
                  <td className="px-4 whitespace-nowrap font-medium">
                    {prod.sale_price > 0
                      ? prod.sale_price.toLocaleString("en-IN")
                      : prod.regular_price?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4">
                    {!isAdmin ? (
                      prod.order_status
                    ) : (
                      <select
                        defaultValue={prod.order_status}
                        onChange={(e) =>
                          setOrderStatus &&
                          setOrderStatus(e.target.value, prod.product_Id)
                        }
                        disabled={prod.order_status === "returned"}
                        className={`border rounded-lg py-2 px-3 text-xs md:text-sm ${renderStatus(prod.order_status)}`}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-4">
                      {prod.order_status !== "Returned" ? (
                        <button
                          onClick={() =>
                            setOrderStatus &&
                            setOrderStatus("Returned", prod.product_Id)
                          }
                          className="px-3 py-2 text-xs md:text-sm rounded bg-gray-200 hover:bg-gray-300"
                        >
                          Mark Returned
                        </button>
                      ) : (
                        <p className="text-green-500 text-sm">Returned</p>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {productsWithDelivery.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="py-6 text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
