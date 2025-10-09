import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import SearchField from "../../../../components/ui/SearchField";
import Pagination from "../../../../components/ui/Pagination";

function CustomersView({
  customers,
  selected,
  toggleSelect,
  onAdd,
  allSelected,
  toggleSelectAll,
  bulkDelete,
  customerPage,
  setCustomerPage,
  customerSearch,
  setCustomerSearch,
  customerPageSize = 10,
  paginatedCustomers,
  filteredCustomers,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / customerPageSize)
  );
  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

    const startPage = Math.max(1, customerPage - Math.floor(maxVisible / 2));
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
          onClick={() => setCustomerPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            customerPage === i
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
    <div>
      <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left: Title + small screen button */}
        <div className="flex items-center justify-between w-full md:w-auto order-1 md:order-1">
          <h3 className="font-semibold sm:text-md text-[15px]">
            Customers ({customers.length})
          </h3>
          {/* Add button only on small screens */}
          <div className="ml-2 md:hidden">
            <AddBtn btnHandler={onAdd}>Add Customer</AddBtn>
          </div>
        </div>

        {/* Middle: Search field */}
        <div className="order-2  w-full md:flex-1 md:flex md:justify-center">
          <SearchField
            placeholder="Search customers..."
            searchValue={customerSearch}
            searchValueChange={(e) => {
              setCustomerSearch(e.target.value);
              setCustomerPage(1);
            }}
          />
        </div>

        {/* Right: Buttons visible on large screens */}
        <div className="hidden md:flex items-center gap-2 order-3 lg:order-2">
          <AddBtn btnHandler={onAdd}>Add Customer</AddBtn>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="bg-gray-50">
            <tr>
              <th>
                <SelectAllCheckbox
                  selected={selected}
                  allSelected={allSelected}
                  toggleSelectAll={toggleSelectAll}
                  isShowCounter={false}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((c) => (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                    checked={selected.includes(c.id)}
                    onChange={() => toggleSelect(c.id)}
                  />
                </td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={customerPage}
        totalPages={totalPages}
        setCurrentPage={setCustomerPage}
        renderPageNumbers={renderPageNumbers}
      />
    </div>
  );
}

export default CustomersView;
