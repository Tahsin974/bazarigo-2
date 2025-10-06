import { motion } from "framer-motion";
import { Search } from "lucide-react";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";

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
  bulkMarkShipped,
  returns,
  setReturns,
}) {
  return (
    <div>
      {active === "Orders" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border rounded px-3 py-2">
                <Search className="text-gray-400" />
                <input
                  value={orderSearch}
                  onChange={(e) => {
                    setOrderSearch(e.target.value);
                    setOrderPage(1);
                  }}
                  placeholder="Search orders..."
                  className="outline-none"
                />
              </div>
              <select
                value={orderSort}
                onChange={(e) => setOrderSort(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="customer">Sort by Customer</option>
                <option value="total">Sort by Total</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={bulkMarkShipped}
                className="px-3 py-2 bg-[#FF0055] text-white rounded"
              >
                Mark Shipped
              </button>
              {/* <button
                onClick={() => {
                  const selected = orders.filter((o) =>
                    selectedOrderIds.includes(o.id)
                  );
                  if (!selected.length) return alert("No orders selected");
                  const ids = selected.map((s) => s.id);
                  setOrders((prev) => prev.filter((o) => !ids.includes(o.id)));
                  setSelectedOrderIds([]);
                  alert("Deleted selected orders");
                }}
                className="px-3 py-2 bg-white border rounded"
              >
                Bulk Delete
              </button> */}
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

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      onChange={(e) =>
                        setSelectedOrderIds(
                          e.target.checked ? orders.map((o) => o.id) : []
                        )
                      }
                      checked={
                        selectedOrderIds.length === orders.length &&
                        orders.length > 0
                      }
                    />
                  </th>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                        checked={selectedOrderIds.includes(o.id)}
                        onChange={() => toggleSelectOrder(o.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{o.number}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3">${o.total}</td>
                    <td className="px-4 py-3">{o.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert(JSON.stringify(o, null, 2))}
                          className="px-3 py-1 border rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setReturns((prev) => [
                              {
                                ...o,
                                returnId: Date.now().toString(),
                                reason: "Customer initiated",
                              },
                              ...prev,
                            ]);
                            alert("Marked as return");
                          }}
                          className="px-3 py-1 border rounded"
                        >
                          Mark Return
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
              {Array.from(
                {
                  length: Math.max(
                    1,
                    Math.ceil(filteredOrders.length / orderPageSize)
                  ),
                },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setOrderPage(i + 1)}
                    className={`px-3 py-1 rounded border ${
                      orderPage === i + 1
                        ? "bg-[#FF0055] text-white"
                        : "bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Returns list */}
          <div className="mt-6">
            <h3 className="font-semibold">Return Orders</h3>
            <div className="mt-3 overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Return ID</th>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {returns.map((r) => (
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
          </div>
        </motion.div>
      )}
    </div>
  );
}
