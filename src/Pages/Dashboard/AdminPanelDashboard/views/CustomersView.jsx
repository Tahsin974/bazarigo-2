import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import SearchField from "../../../../components/ui/SearchField";
import Pagination from "../../../../components/ui/Pagination";
import { motion } from "framer-motion";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import { PlusCircle } from "lucide-react";

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
            <AddBtn btnHandler={onAdd}>
              <PlusCircle /> Add Customer
            </AddBtn>
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
          <AddBtn btnHandler={onAdd}>
            <PlusCircle /> Add Customer
          </AddBtn>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-box">
        <table className="table text-center">
          {/* head */}
          <thead className="bg-gray-50 ">
            <tr className="text-black">
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
        renderPageNumbers={useRenderPageNumbers(
          customerPage,
          totalPages,
          setCustomerPage
        )}
      />
    </div>
  );
}

export default CustomersView;
