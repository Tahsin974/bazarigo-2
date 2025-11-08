import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import SearchField from "../../../../components/ui/SearchField";
import Pagination from "../../../../components/ui/Pagination";
import { motion } from "framer-motion";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import { Eye, PlusCircle } from "lucide-react";

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
  openCustomerModal,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / customerPageSize)
  );

  const renderPageNumbers = useRenderPageNumbers(
    customerPage,
    totalPages,
    setCustomerPage
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

      {customers.length === 0 ? (
        <div>
          <div className="flex flex-col items-center justify-center py-20">
            customers not found
          </div>
        </div>
      ) : customers.length === null ? (
        <div>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        </div>
      ) : (
        <>
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
                  <th>User Name</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Action</th>
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
                    <td>{c.user_name}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>0</td>
                    <td>
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openCustomerModal(c)}
                          className=" px-3 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900 "
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

          <Pagination
            currentPage={customerPage}
            totalPages={totalPages}
            setCurrentPage={setCustomerPage}
            renderPageNumbers={renderPageNumbers}
          />
        </>
      )}
    </div>
  );
}

export default CustomersView;
