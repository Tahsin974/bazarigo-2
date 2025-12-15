import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";
import { Eye, MoreHorizontal } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import { motion } from "framer-motion";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../../Utils/Hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";

function OrdersView({
  orders,
  returns,
  selected,
  toggleSelect,
  allSelected,
  toggleSelectAll,
  orderPage,
  setOrderPage,
  orderSearch,
  setOrderSearch,
  orderPageSize = 10,
  paginatedOrders,
  filteredOrders,
  returnOrderPage,
  setReturnOrderPage,
  filteredReturnOrders,
  paginatedReturnOrders,
  returnOrderPageSize = 10,
  returnOrderSearch,
  setReturnOrderSearch,
  openOrderModal,
  refetch,
}) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / orderPageSize)
  );
  console.log(paginatedReturnOrders);

  const returnOrdersTotalPages = Math.max(
    1,
    Math.ceil(filteredReturnOrders.length / returnOrderPageSize)
  );

  // const updateStatus = (orderId, newStatus) => {
  //   setOrders((prev) =>
  //     prev.map((order) =>
  //       order.orderId === orderId ? { ...order, status: newStatus } : order
  //     )
  //   );
  // };

  const activeOrders = paginatedOrders.filter(
    (order) => order.order_status !== "Cancelled"
  );

  const renderPageNumbers = useRenderPageNumbers(
    orderPage,
    totalPages,
    setOrderPage
  );

  const renderReturnPageNumbers = useRenderPageNumbers(
    returnOrderPage,
    returnOrdersTotalPages,
    setReturnOrderPage
  );

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No orders selected",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top",
      });
      return;
    }

    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete selected orders?",
        showCancelButton: true,
        confirmButtonColor: "#00C853",
        cancelButtonColor: "#f72c2c",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const res = await axiosPublic.delete("/orders/bulk-delete", {
          data: { ids: selected },
        });

        if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Selected Products deleted successfully",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops! Try again",
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            position: "top",
          });
        }

        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.message,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
    }
  };

  const getProductsTotal = (order) => {
    const products = order.order_items.flatMap((item) => {
      return item.productinfo;
    });
    return products.length;
  };
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          {/* Left: SelectAll + Title + small screen DeleteAll */}
          <div className="flex items-center justify-between w-full md:w-auto order-1 md:order-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold sm:text-base text-sm">
                Active Orders ({orders.length})
              </h3>
            </div>
            {/* DeleteAllBtn only on small screens */}

            {user.role !== "moderator" && (
              <div className="ml-2 md:hidden">
                <DeleteAllBtn
                  selected={selected}
                  bulkDelete={handleBulkDelete}
                />
              </div>
            )}
          </div>

          {/* Middle: Search field */}
          <div className="order-2 md:order-2 w-full md:flex-1 md:flex md:justify-center">
            <SearchField
              placeholder="Search orders..."
              searchValue={orderSearch}
              searchValueChange={(e) => {
                setOrderSearch(e.target.value);
                setOrderPage(1);
              }}
            />
          </div>

          {/* Right: DeleteAllBtn on large screens */}
          {user.role !== "moderator" && (
            <div className="hidden md:flex order-3">
              <DeleteAllBtn selected={selected} bulkDelete={handleBulkDelete} />
            </div>
          )}
        </div>

        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          {activeOrders.length === 0 ? (
            <div>
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
                <span className="font-semibold">orders not found</span>
              </div>
            </div>
          ) : activeOrders.length === null ? (
            <Loading />
          ) : (
            <>
              <div className="overflow-x-auto bg-white rounded-box  ">
                <table className="table  text-center">
                  {/* head */}
                  <thead className="text-black">
                    <tr>
                      {user.role !== "moderator" && (
                        <th>
                          <SelectAllCheckbox
                            selected={selected}
                            allSelected={allSelected}
                            toggleSelectAll={toggleSelectAll}
                            isShowCounter={false}
                          />
                        </th>
                      )}

                      <th># Order</th>
                      <th>Customer Name</th>
                      <th>Total</th>
                      <th>Products</th>

                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {activeOrders.map((o) => (
                      <tr key={o.orderId} className="border-t">
                        {user.role !== "moderator" && (
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                              checked={selected.includes(o.order_id)}
                              onChange={() => toggleSelect(o.order_id)}
                            />
                          </td>
                        )}

                        <td>
                          <span className="font-semibold">{o.order_id}</span>{" "}
                        </td>
                        <td>
                          <span className="font-semibold">
                            {o.customer_name}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold">
                            ৳{o.total.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td>
                          <span className="font-semibold">
                            {getProductsTotal(o)}
                          </span>
                        </td>

                        <td>
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => openOrderModal(o)}
                              className="px-3 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900"
                            >
                              <Eye size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={orderPage}
                  totalPages={totalPages}
                  setCurrentPage={setOrderPage}
                  renderPageNumbers={renderPageNumbers}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h3 className="font-semibold sm:text-base text-sm">
            Return Orders {!returns?.length ? "" : <>({returns?.length})</>}
          </h3>
          <div>
            <SearchField
              placeholder="Search return orders..."
              searchValue={returnOrderSearch}
              searchValueChange={(e) => {
                setReturnOrderSearch(e.target.value);
                setReturnOrderPage(1);
              }}
            />
          </div>
        </div>
        {paginatedReturnOrders.length === 0 ? (
          <div>
            <div className="mt-3 flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
              <span className="font-semibold">return orders not found</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-3 bg-white p-3 rounded shadow-sm">
              <div className="overflow-x-auto bg-white rounded-box">
                <table className="table text-center">
                  {/* head */}
                  <thead className="bg-gray-50 ">
                    <tr className="text-black">
                      <th className="px-4 py-3">Return ID</th>
                      <th className="px-4 py-3">Order #</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Products</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReturnOrders.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="px-4 py-3">
                          <span className="font-semibold">{r.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{r.order_id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {r.customer_name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {r.reason || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {r.products.length}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {returnOrdersTotalPages > 1 && (
              <Pagination
                currentPage={returnOrderPage}
                totalPages={returnOrdersTotalPages}
                setCurrentPage={setReturnOrderPage}
                renderPageNumbers={renderReturnPageNumbers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrdersView;
