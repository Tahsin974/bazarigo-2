import { MoreHorizontal, ZapIcon } from "lucide-react";
import AddBtn from "../../../../components/ui/AddBtn";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import SelectField from "../../../../components/ui/SelectField";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

export default function FlashSaleView({
  products,
  selected,
  setSelected,
  toggleSelect,
  allSelected,
  toggleSelectAll,
  productPage,
  setProductPage,
  productPageSize = 10,
  filteredProducts,
  paginatedProducts,
  productSearch,
  setProductSearch,
  productSort,
  setProductSort,

  setFlashSaleProducts,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productPageSize)
  );
  const handleApplySale = () => {
    const updatedProducts = products.map((prod) =>
      selected.includes(prod.id) ? { ...prod, isFlashSale: true } : prod
    );

    setFlashSaleProducts(updatedProducts);
  };

  // const autoSelect = () => {
  //   const candidates = products.filter(
  //     (p) => (p.rating > 4 || p.isNew) && p.stock > 10
  //   );

  //   setSelected(candidates.map((p) => p.id));
  // };
  const autoSelect = () => {
    const candidates = products.filter(
      (p) => (p.rating > 4 || p.isNew) && p.stock > 30
    );

    setSelected(candidates.map((p) => p.id));
  };
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left: SelectAll + Title + small screen Add/Delete buttons */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto order-1  gap-4">
          <div className="flex items-center gap-4">
            <div className="font-medium sm:text-md text-[15px]">
              Total Products ({products.length})
            </div>
            <div className="font-medium sm:text-md text-[15px]">
              Selected Products ({selected.length})
            </div>
          </div>
          {/* Small screen buttons */}
          <div className="ml-2 lg:hidden flex gap-2">
            <AddBtn btnHandler={autoSelect}>Auto Select</AddBtn>

            {!selected.length ? (
              <button
                className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none sm:text-base text-xs"
                disabled="disabled"
              >
                Apply Sale
              </button>
            ) : (
              <AddBtn btnHandler={handleApplySale}>Apply Sale</AddBtn>
            )}
          </div>
        </div>

        {/* Middle: Search + Sort */}
        <div className="order-2    flex flex-wrap   gap-3 items-center ">
          <div className="w-full order-2 xl:w-auto lg:w-auto md:w-auto xl:order-1 lg:order-1 md:order-1 ">
            <SearchField
              placeholder="Search products..."
              searchValue={productSearch}
              searchValueChange={(e) => {
                setProductSearch(e.target.value);
                setProductPage(1);
              }}
            />
          </div>
          <div className="xl:order-2 lg:order-2 md:order-2 order-1 ">
            <SelectField
              selectValue={productSort}
              selectValueChange={(e) => setProductSort(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </SelectField>
          </div>
        </div>

        {/* Right: Buttons on large screens */}
        <div className="hidden lg:flex gap-2 order-3 ">
          <AddBtn
            btnHandler={autoSelect}
            bgColor="#FF0055"
            bgColorHover="#e6004e"
          >
            Auto Select
          </AddBtn>

          {!selected.length ? (
            <button
              className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none sm:text-base text-xs"
              disabled="disabled"
            >
              Apply Sale
            </button>
          ) : (
            <AddBtn btnHandler={handleApplySale}>Apply Sale</AddBtn>
          )}
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
        <table className="table  text-center">
          {/* head */}
          <thead className="text-black">
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
              <th>Category</th>
              <th>Base Price</th>
              <th>Stock</th>
              <th>Sale Status</th>
            </tr>
          </thead>
          <tbody className="">
            {paginatedProducts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={p.images[0]} alt={p.name} />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold">{p.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3">৳{p.price}</td>
                <td>{p.stock}</td>
                <td>
                  {p.isFlashSale ? (
                    <p className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <ZapIcon className="w-3 h-3 mr-1 fill-red-800" />{" "}
                      {p.discount}% off
                    </p>
                  ) : (
                    <p className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                      Inactive
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className=" flex items-center justify-center">
        <Pagination
          currentPage={productPage}
          totalPages={totalPages}
          setCurrentPage={setProductPage}
          renderPageNumbers={useRenderPageNumbers(
            productPage,
            totalPages,
            setProductPage
          )}
        />
      </div>
    </div>
  );
}
