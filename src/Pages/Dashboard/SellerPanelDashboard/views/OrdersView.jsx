import { motion } from "framer-motion";
import { MoreHorizontal, Search } from "lucide-react";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import Pagination from "../../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

export default function OrdersView({
  active,
  orders,
  setOrders,
  orderSearch,
  setOrderSearch,
  orderSort,
  setOrderSort,
  orderPage,
  setOrderPage,
  orderPageSize = 10,
  selectedOrderIds,
  setSelectedOrderIds,
  paginatedOrders,
  filteredOrders,
  toggleSelectOrder,

  returns,
  returnOrderPage,
  setReturnOrderPage,

  paginatedReturnOrders,
  returnOrderPageSize = 10,
  returnOrderSearch,
  setReturnOrderSearch,
  filteredReturnOrders,
}) {
  console.log(paginatedReturnOrders);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / orderPageSize)
  );

  const returnOrdersTotalPages = Math.max(
    1,
    Math.ceil(filteredReturnOrders.length / returnOrderPageSize)
  );

  const renderPageNumbers = useRenderPageNumbers(
    orderPage,
    totalPages,
    setOrderPage
  );
  const renderReturnOrdersPageNumbers = useRenderPageNumbers(
    returnOrderPage,
    returnOrdersTotalPages,
    setReturnOrderPage
  );

  return (
    <div>
      {active === "Orders" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <SearchField
                searchValue={orderSearch}
                searchValueChange={(e) => {
                  setOrderSearch(e.target.value);
                  setOrderPage(1);
                }}
                placeholder="Search orders..."
              />

              <SelectField
                selectValue={orderSort}
                selectValueChange={(e) => setOrderSort(e.target.value)}
              >
                <option value="customer">Sort by Customer</option>
                <option value="total">Sort by Total</option>
              </SelectField>
            </div>

            <div className="flex items-center gap-2">
              <DeleteAllBtn
                selected={selectedOrderIds}
                bulkDelete={() => {
                  const selected = orders.filter((o) =>
                    selectedOrderIds.includes(o.id)
                  );
                  if (!selected.length) return alert("No orders selected");
                  const ids = selected.map((s) => s.id);
                  setOrders((prev) => prev.filter((o) => !ids.includes(o.id)));
                  setSelectedOrderIds([]);
                  alert("Deleted selected orders");
                }}
              />
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* head */}
              <thead className="text-black">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      onChange={(e) =>
                        setSelectedOrderIds(
                          e.target.checked ? orders.map((o) => o.orderId) : []
                        )
                      }
                      checked={
                        selectedOrderIds.length === orders.length &&
                        orders.length > 0
                      }
                    />
                  </th>
                  <th># Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {paginatedOrders.map((o) => (
                  <tr key={o.orderId} className="border-t">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                        checked={selectedOrderIds.includes(o.orderId)}
                        onChange={() => toggleSelectOrder(o.orderId)}
                      />
                    </td>
                    <td>{o.number} </td>
                    <td>{o.customer}</td>
                    <td>৳{o.total}</td>
                    <td>{o.status}</td>
                    <td>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => alert(JSON.stringify(o, null, 2))}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {orders.length} total orders • Returns: {returns.length}
            </div>
            <div className="flex items-center gap-2">
              <Pagination
                currentPage={orderPage}
                totalPages={totalPages}
                setCurrentPage={setOrderPage}
                renderPageNumbers={renderPageNumbers}
              />
            </div>
          </div>

          {/* Returns list */}
          <div className="mt-6">
            <div className="flex items-center justify-between flex-wrap">
              <h3 className="font-semibold">
                Return Orders ({returns.length})
              </h3>
              <SearchField
                placeholder="Search return orders..."
                searchValue={returnOrderSearch}
                searchValueChange={(e) => {
                  setReturnOrderSearch(e.target.value);
                  setReturnOrderPage(1);
                }}
              />
            </div>
            <div className="overflow-x-auto bg-white rounded-box">
              <table className="table text-center">
                {/* head */}
                <thead className="bg-gray-50 ">
                  <tr className="text-black">
                    <th className="px-4 py-3">Return ID</th>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReturnOrders.map((r) => (
                    <tr key={r.returnId} className="border-t">
                      <td className="px-4 py-3">{r.returnId}</td>
                      <td className="px-4 py-3">{r.number}</td>
                      <td className="px-4 py-3">{r.customer}</td>
                      <td className="px-4 py-3">{r.reason || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Pagination
                  currentPage={returnOrderPage}
                  totalPages={returnOrdersTotalPages}
                  setCurrentPage={setReturnOrderPage}
                  renderPageNumbers={renderReturnOrdersPageNumbers}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
