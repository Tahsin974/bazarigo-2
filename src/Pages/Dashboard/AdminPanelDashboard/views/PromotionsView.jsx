import React from "react";
import AddBtn from "../../../../components/ui/AddBtn";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

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

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left (Title + Button on small screens) */}
        <div className="flex items-center justify-between w-full md:w-auto order-1 md:order-1">
          <h3 className="font-semibold sm:text-md text-[15px]">
            Promotions ({promotions.length})
          </h3>
          {/* Hide this button on md+, show only on sm */}
          <div className="ml-2 lg:hidden">
            <AddBtn btnHandler={onAdd}>New Promotion</AddBtn>
          </div>
        </div>

        {/* Middle (Search field, center on large screens) */}
        <div className="order-2 md:order-2 w-full md:flex-1 md:flex md:justify-center">
          <SearchField
            placeholder="Search customers..."
            searchValue={promoSearch}
            searchValueChange={(e) => {
              setPromoSearch(e.target.value);
              setPromoPage(1);
            }}
          />
        </div>

        {/* Right (Button on md+ only) */}
        <div className="hidden lg:block order-3">
          <AddBtn btnHandler={onAdd}>New Promotion</AddBtn>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-3">
        {promotions.map((p) => (
          <div
            key={p.id}
            className="flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-between border-b py-2 gap-4"
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
                  p.active
                    ? "bg-[#00C853] hover:bg-[#00B34A] text-white"
                    : "text-white bg-[#f72c2c] hover:bg-[#e92323]"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => removePromo(p.id)}
                className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white "
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={promoPage}
        totalPages={totalPages}
        setCurrentPage={setPromoPage}
        renderPageNumbers={useRenderPageNumbers(
          promoPage,
          totalPages,
          setPromoPage
        )}
      />
    </div>
  );
}

export default PromotionsView;
