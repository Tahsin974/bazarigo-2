import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";

function OrdersView({
  orders,
  returns,
  selected,
  toggleSelect,
  setOrders,
  allSelected,
  toggleSelectAll,
  bulkDelete,
}) {
  const markAsReturned = (id) =>
    setOrders((os) =>
      os.map((o) => (o.id === id ? { ...o, status: "returned" } : o))
    );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SelectAllCheckbox
              selected={selected}
              allSelected={allSelected}
              toggleSelectAll={toggleSelectAll}
              isShowCounter={false}
            />
            <h3 className="font-semibold">Active Orders ({orders.length})</h3>
          </div>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>

        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          {orders.length === 0 && (
            <div className="text-sm text-gray-500">No orders</div>
          )}
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                  checked={selected.includes(o.id)}
                  onChange={() => toggleSelect(o.id)}
                />
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-xs text-gray-500">{o.customer}</div>
                </div>
              </div>
              <div className="text-right">
                <div>${o.total}</div>
                <div className="text-xs text-gray-500">{o.status}</div>
                <div className="mt-2 flex gap-2 justify-end">
                  {o.status !== "returned" && (
                    <button
                      onClick={() => markAsReturned(o.id)}
                      className="px-2 py-1 rounded bg-yellow-400"
                    >
                      Mark Returned
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Return Orders ({returns.length})</h3>
        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          {returns.length === 0 && (
            <div className="text-sm text-gray-500">No return orders</div>
          )}
          {returns.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between border-b py-2"
            >
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-gray-500">{o.customer}</div>
              </div>
              <div className="text-right">
                <div>${o.total}</div>
                <div className="text-xs text-gray-500">Returned</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersView;
