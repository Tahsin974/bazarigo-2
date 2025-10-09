import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";
import { MoreHorizontal } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";

function OrdersView({
  orders,
  returns,
  selected,
  toggleSelect,
  setOrders,
  allSelected,
  toggleSelectAll,
  bulkDelete,
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
}) {
  const markAsReturned = (id) =>
    setOrders((os) =>
      os.map((o) => (o.id === id ? { ...o, status: "returned" } : o))
    );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / orderPageSize)
  );

  const returnOrdersTotalPages = Math.max(
    1,
    Math.ceil(filteredReturnOrders.length / returnOrderPageSize)
  );

  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

    const startPage = Math.max(1, orderPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    const pages = [];

    if (startPage > 1) {
      pages.push(
        <MoreHorizontal
          key="start-ellipsis"
          className="w-5 h-5 text-gray-400"
        />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setOrderPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            orderPage === i
              ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055] "
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 "
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
      );
    }

    return pages;
  };
  const renderReturnOrdersPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

    const startPage = Math.max(1, returnOrderPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(
      returnOrdersTotalPages,
      startPage + maxVisible - 1
    );

    const pages = [];

    if (startPage > 1) {
      pages.push(
        <MoreHorizontal
          key="start-ellipsis"
          className="w-5 h-5 text-gray-400"
        />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setReturnOrderPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            orderPage === i
              ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055] "
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 "
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
      );
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          {/* Left: SelectAll + Title + small screen DeleteAll */}
          <div className="flex items-center justify-between w-full md:w-auto order-1 md:order-1">
            <div className="flex items-center gap-2">
              <SelectAllCheckbox
                selected={selected}
                allSelected={allSelected}
                toggleSelectAll={toggleSelectAll}
                isShowCounter={false}
              />
              <h3 className="font-semibold sm:text-base text-sm">
                Active Orders ({orders.length})
              </h3>
            </div>
            {/* DeleteAllBtn only on small screens */}
            <div className="ml-2 md:hidden">
              <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
            </div>
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
          <div className="hidden md:flex order-3">
            <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
          </div>
        </div>

        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          {orders.length === 0 && (
            <div className="text-sm text-gray-500">No orders</div>
          )}
          {paginatedOrders.map((o) => (
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
        <Pagination
          currentPage={orderPage}
          totalPages={totalPages}
          setCurrentPage={setOrderPage}
          renderPageNumbers={renderPageNumbers}
        />
      </div>

      <div>
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h3 className="font-semibold sm:text-base text-sm">
            Return Orders ({returns.length})
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
        <div className="mt-3 bg-white p-3 rounded shadow-sm">
          {returns.length === 0 && (
            <div className="text-sm text-gray-500">No return orders</div>
          )}
          {paginatedReturnOrders.map((o) => (
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
        <Pagination
          currentPage={returnOrderPage}
          totalPages={returnOrdersTotalPages}
          setCurrentPage={setReturnOrderPage}
          renderPageNumbers={renderReturnOrdersPageNumbers}
        />
      </div>
    </div>
  );
}

export default OrdersView;
