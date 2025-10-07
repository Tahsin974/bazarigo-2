import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import { MoreHorizontal } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import Pagination from "../../../../components/ui/Pagination";

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
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSellers.length / sellerPageSize)
  );
  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

    const startPage = Math.max(1, sellerPage - Math.floor(maxVisible / 2));
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
          onClick={() => setSellerPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            sellerPage === i
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
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          <SelectAllCheckbox
            selected={selected}
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
          />
          <h3 className="font-semibold">Sellers ({sellers.length})</h3>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <SearchField
              placeholder="Search sellers..."
              searchValue={sellerSearch}
              searchValueChange={(e) => {
                setSellerSearch(e.target.value);
                setSellerPage(1);
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AddBtn btnHandler={onAdd}>Add Seller</AddBtn>

          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSellers.map((s) => (
          <div
            key={s.id}
            className="bg-white p-3 rounded shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">{s.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                checked={selected.includes(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
              <button className="px-3 py-1 rounded border">View</button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={sellerPage}
        totalPages={totalPages}
        setCurrentPage={setSellerPage}
        renderPageNumbers={renderPageNumbers}
      />
    </div>
  );
}

export default SellersView;
