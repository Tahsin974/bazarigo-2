import React from "react";
import AddBtn from "../../../../components/ui/AddBtn";
import { MoreHorizontal } from "lucide-react";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";

function PromotionsView({
  promotions,
  onAdd,
  setPromotions,
  promoPage,
  setPromoPage,
  promoSearch,
  setPromoSearch,
  promoPageSize = 10,
  filteredPromotions,
}) {
  const toggleActive = (id) =>
    setPromotions((p) =>
      p.map((x) => (x.id === id ? { ...x, active: !x.active } : x))
    );
  const removePromo = (id) =>
    setPromotions((p) => p.filter((x) => x.id !== id));

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPromotions.length / promoPageSize)
  );
  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

    const startPage = Math.max(1, promoPage - Math.floor(maxVisible / 2));
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
          onClick={() => setPromoPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            promoPage === i
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Promotions ({promotions.length})</h3>

        <SearchField
          placeholder="Search customers..."
          searchValue={promoSearch}
          searchValueChange={(e) => {
            setPromoSearch(e.target.value);
            setPromoPage(1);
          }}
        />

        <AddBtn btnHandler={onAdd}> New Promotion</AddBtn>
      </div>
      <div className="bg-white rounded shadow-sm p-3">
        {promotions.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <div className="font-medium">
                {p.code}{" "}
                <span className="text-xs text-gray-500">{p.discount}</span>
              </div>
              <div className="text-xs text-gray-500">
                {p.start || "-"} → {p.end || "-"}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleActive(p.id)}
                className={`px-2 py-1 rounded ${
                  p.active ? "bg-green-500 text-white" : "border"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => removePromo(p.id)}
                className="px-2 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={promoPage}
        totalPages={totalPages}
        setCurrentPage={setPromoPage}
        renderPageNumbers={renderPageNumbers}
      />
    </div>
  );
}

export default PromotionsView;
