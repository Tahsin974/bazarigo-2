import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import {
  CircleCheckBig,
  CircleX,
  Eye,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import Pagination from "../../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import axios from "axios";

function SellersView({
  sellers,
  selected,
  toggleSelect,
  onAdd,
  allSelected,
  toggleSelectAll,
  bulkDelete,
  sellerPage,
  setSellerPage,
  sellerSearch,
  setSellerSearch,
  sellerPageSize = 10,
  filteredSellers,
  openSellerModal,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSellers.length / sellerPageSize)
  );
  const handleAccept = async (id) => {
    const res = await axios.patch(
      `http://localhost:3000/sellers/${id}/status`,
      {
        status: "seller",
      }
    );
  };

  return (
    <div>
      <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left: Title + Select All */}
        <div className="flex flex-wrap items-center gap-2 justify-between w-full md:w-auto order-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold sm:text-md text-[15px]">
              Sellers ({sellers.length})
            </h3>
          </div>

          {/* Add/Delete buttons visible only on small screens */}
          <div className="flex items-center gap-2 lg:hidden">
            <AddBtn btnHandler={onAdd}>
              <PlusCircle /> Add Seller
            </AddBtn>
            <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
          </div>
        </div>

        {/* Middle: Search field (centered on large screens) */}
        <div className="order-2 w-full md:flex-1 md:flex md:justify-center">
          <SearchField
            placeholder="Search sellers..."
            searchValue={sellerSearch}
            searchValueChange={(e) => {
              setSellerSearch(e.target.value);
              setSellerPage(1);
            }}
          />
        </div>

        {/* Right: Add/Delete buttons (visible on large screens) */}
        <div className="hidden lg:flex items-center gap-2 order-3">
          <AddBtn btnHandler={onAdd}>
            <PlusCircle /> Add Seller
          </AddBtn>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>
      <div className="mt-3 bg-white p-3 rounded shadow-sm">
        {sellers.length === 0 ? (
          <div>
            <div className="flex flex-col items-center justify-center py-20">
              sellers not found
            </div>
          </div>
        ) : sellers.length === null ? (
          <div>
            <div className="flex flex-col items-center justify-center min-h-screen">
              <span className="loading loading-spinner loading-xl"></span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-box">
            <table className="table text-center">
              {/* head */}
              <thead className="bg-gray-50 ">
                <tr className="text-black">
                  <th className="px-4 py-3">
                    <SelectAllCheckbox
                      selected={selected}
                      allSelected={allSelected}
                      toggleSelectAll={toggleSelectAll}
                      isShowCounter={false}
                    />
                  </th>
                  <th className="px-4 py-3">Seller ID</th>
                  <th className="px-4 py-3">Seller Name</th>
                  <th className="px-4 py-3">Seller Store Name</th>
                  <th className="px-4 py-3">Seller Email</th>
                  <th className="px-4 py-3"> Phone</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSellers.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">
                      {" "}
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                        checked={selected.includes(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td className="px-4 py-3">{s.id}</td>
                    <td className="px-4 py-3">{s.full_name}</td>
                    <td className="px-4 py-3">{s.store_name}</td>
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3">{s.phone_number}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openSellerModal(s)}
                          className="px-3 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900"
                        >
                          <Eye size={20} />
                        </button>
                        {s.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccept(s.id)}
                              className="px-3 py-2  rounded bg-green-100 hover:bg-green-600 text-green-600 hover:text-white cursor-pointer"
                            >
                              <CircleCheckBig size={20} />
                            </button>
                            <button className="px-3 py-2  rounded bg-red-100 hover:bg-red-600 text-red-600 hover:text-white cursor-pointer">
                              <CircleX size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={sellerPage}
        totalPages={totalPages}
        setCurrentPage={setSellerPage}
        renderPageNumbers={useRenderPageNumbers(
          sellerPage,
          totalPages,
          setSellerPage
        )}
      />
    </div>
  );
}

export default SellersView;
