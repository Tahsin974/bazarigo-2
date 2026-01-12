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
  const productsWithDelivery = items?.flatMap((item) => {
    return item.productinfo.map((prod) => ({
      ...prod,
      cart_id: item.cartid,
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
      options
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

  return (
    <div
      className="bg-white rounded-2xl shadow-xl border overflow-x-auto"
      style={{ borderColor: PRIMARY_COLOR }}
    >
      <h3
        className="text-xl font-bold p-6 text-gray-800 flex items-center border-b border-gray-200"
        style={{ color: PRIMARY_COLOR }}
      >
        <DollarSign size={20} className="mr-2" /> Product Details
      </h3>
      <div className="overflow-x-auto bg-white rounded-box  ">
        <table className="table  text-center">
          {/* head */}
          <thead className="text-black">
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Est.delivery</th>
              <th>Price</th>
              <th>Order Status</th>
              {(user?.role === "admin" || user?.role === "super admin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {productsWithDelivery.map((prod, index) => (
              <tr key={index} className="border-t">
                <td>{prod.product_name} </td>
                <td>{prod?.brand || "No Brand"}</td>
                <td>{prod.qty}</td>
                <td>{getEstimatedDelivery(date, prod.delivery_time)}</td>
                <td>
                  {prod.sale_price > 0
                    ? prod.sale_price.toLocaleString("en-IN")
                    : prod.regular_price.toLocaleString("en-IN")}
                </td>
                <td>
                  {user?.role !== "admin" && user?.role !== "super admin" ? (
                    prod.order_status
                  ) : (
                    <div
                      className={`relative w-auto inline-flex items-center  `}
                    >
                      <select
                        defaultValue={prod.order_status}
                        onChange={(e) =>
                          setOrderStatus(e.target.value, prod.product_Id)
                        }
                        disabled={prod.order_status === "returned"}
                        className={`appearance-none focus:outline-none rounded-lg py-2 pl-2 pr-10 text-sm font-medium  shadow-sm  transition duration-150 cursor-pointer   ${renderStatus(
                          prod.order_status
                        )}`}
                        style={{ fontFamily: "Poppins", fontWeight: 700 }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </td>
                {user?.role === "admin" ||
                  (user?.role === "super admin" && (
                    <td>
                      <div className=" flex gap-2 justify-end">
                        {prod.order_status !== "Returned" ? (
                          <button
                            onClick={() =>
                              setOrderStatus("Returned", prod.product_Id)
                            }
                            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                          >
                            Mark Returned
                          </button>
                        ) : (
                          <p className="text-green-400"> {prod.order_status}</p>
                        )}
                      </div>
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
