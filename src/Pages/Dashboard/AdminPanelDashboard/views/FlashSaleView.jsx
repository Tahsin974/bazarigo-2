import { Trash2, ZapIcon } from "lucide-react";
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
  displayProducts,
  setDisplayProducts,
  flashSaleProducts,
  setFlashSaleProducts,
  manualDiscount,
  setManualDiscount,
  flashSaleProductPage,
  setFlashSaleProductPage,
  duration,
  setDuration,
  openDiscountModal,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productPageSize)
  );

  const handleApplySale = () => {
    const minDiscount = 10; // minimum discount %
    const maxDiscount = 30; // maximum discount %

    const updatedFlashSaleProducts = [];
    const updatedDisplayProducts = displayProducts.map((prod) => {
      if (selected.includes(prod.id)) {
        // Calculate new stock for flash sale
        const minStock = prod.stock > 50 ? 45 : 30;
        const maxStock = 50;

        const discount =
          manualDiscount.id === prod.id
            ? manualDiscount.discount
            : Math.floor(Math.random() * (maxDiscount - minDiscount + 1)) +
              minDiscount;
        const flashSaleStock =
          Math.floor(Math.random() * (maxStock - minStock + 1)) + minStock;

        // Update flash sale products
        updatedFlashSaleProducts.push({
          ...prod,
          isFlashSale: true,
          discount,
          oldPrice: prod.price,
          price: Math.round(prod.price - (prod.price * discount) / 100),
          stock: flashSaleStock,
        });

        const existingProducts = flashSaleProducts.find(
          (p) => p.id === prod.id
        );
        if (existingProducts) {
          return {
            ...prod,
            discount: manualDiscount.id === prod.id && manualDiscount,
          };
        }

        // Update displayProducts with remaining stock
        return {
          ...prod,
          discount,
          isFlashSale: true,
          stock: (prod.remainStocks ?? prod.stock) - flashSaleStock,
        };
      }
      return prod;
    });

    setDisplayProducts(updatedDisplayProducts);
    setFlashSaleProducts({
      isActive: true,
      duration,
      saleProducts: updatedFlashSaleProducts,
    });
  };

  // const filteredFlashSaleProducts = flashSaleProducts.filter(
  //   (prod) => prod.isFlashSale === true
  // );
  const flashSaleTotalPages = Math.max(
    1,
    Math.ceil(flashSaleProducts.saleProducts?.length / 6)
  );

  // const autoSelect = () => {
  //   const candidates = products.filter(
  //     (p) => (p.rating > 4 || p.isNew) && p.stock > 10
  //   );

  //   setSelected(candidates.map((p) => p.id));
  // };
  const autoSelect = () => {
    const candidates = products.filter(
      (p) => (p.rating > 4.5 || p.isNew) && p.stock > 30
    );
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const limited = shuffled.slice(0, 100);

    setSelected(limited.map((p) => p.id));
  };

  const renderPageNumbers = useRenderPageNumbers(
    flashSaleProductPage,
    flashSaleTotalPages,
    setFlashSaleProductPage
  );
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
          {/* Left: SelectAll + Title + small screen Add/Delete buttons */}
          <div className="flex  items-center justify-between w-full md:w-auto order-1  gap-4">
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
                  className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none sm:text-base text-[14px]"
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
            <div className="w-full order-3 xl:w-auto lg:w-auto md:w-auto xl:order-1 lg:order-1 md:order-1 ">
              <SearchField
                placeholder="Search products..."
                searchValue={productSearch}
                searchValueChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
              />
            </div>
            <div className="xl:order-2 lg:order-2 md:order-2 order-1">
              <SelectField
                selectValue={productSort}
                selectValueChange={(e) => setProductSort(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
              </SelectField>
            </div>
            <div className="xl:order-3 lg:order-3 md:order-3 order-2">
              <SelectField
                selectValue={duration}
                selectValueChange={(e) => setDuration(e.target.value)}
              >
                <option value={0} disabled>
                  set Duration
                </option>
                <option value={43200}>12 Hours</option>
                <option value={86400}>24 Hours</option>
                <option value={172800}>48 Hours</option>
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
                className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none sm:text-base text-[14px]"
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
                <th>Action</th>
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
                      <p className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-200 text-green-800">
                        Active
                      </p>
                    ) : (
                      <p className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-200 text-red-800">
                        Inactive
                      </p>
                    )}
                  </td>
                  <td>
                    <>
                      {selected.includes(p.id) ? (
                        <button
                          className={`cursor-pointer ${
                            manualDiscount.id === p.id
                              ? "inline-flex items-center px-3 py-1 rounded text-base font-medium bg-red-100 text-red-800"
                              : "px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                          } `}
                          onClick={() => openDiscountModal(p)}
                        >
                          {manualDiscount.id === p.id ? (
                            <>
                              <ZapIcon className="w-3 h-3 mr-1 fill-red-800" />
                              {manualDiscount.discount}% off
                            </>
                          ) : (
                            "Discount"
                          )}
                        </button>
                      ) : (
                        <button
                          className="bg-gray-300 text-gray-500
          px-3 py-1    border-none  rounded shadow inline-flex items-center text-base
          "
                          disabled="disabled"
                        >
                          {manualDiscount.id === p.id ? (
                            <>
                              <ZapIcon className="w-3 h-3 mr-1 fill-red-800" />
                              {manualDiscount.discount}% off
                            </>
                          ) : (
                            "Discount"
                          )}
                        </button>
                      )}
                    </>
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
      <h1 className="text-lg">
        FlashSale Products{" "}
        {!flashSaleProducts.saleProducts?.length ? (
          ""
        ) : (
          <>({flashSaleProducts.saleProducts?.length})</>
        )}
      </h1>
      {flashSaleProducts.saleProducts?.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-8">
          No products found
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* Head */}
              <thead className="text-black">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Old Price</th>
                  <th>Base Price</th>
                  <th>Stock</th>
                  <th>Sale Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(flashSaleProducts.saleProducts || [])
                  .slice(
                    (flashSaleProductPage - 1) * 6,
                    flashSaleProductPage * 6
                  )
                  .map((p) => (
                    <tr key={p.id} className="border-t">
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
                      <td>{p.category}</td>
                      <td>৳{p.oldPrice}</td>
                      <td>৳{p.price}</td>
                      <td>{p.stock}</td>

                      <td>
                        {p.isFlashSale ? (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-medium bg-red-100 text-red-800">
                            <ZapIcon className="w-3 h-3 mr-1 fill-red-800" />{" "}
                            {p.discount}% off
                          </p>
                        ) : (
                          <p className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                            Inactive
                          </p>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (confirm("Delete product?"))
                              setFlashSaleProducts((prev) =>
                                prev.filter((x) => x.id !== p.id)
                              );
                            setDisplayProducts((prev) =>
                              prev.map((x) =>
                                x.id === p.id ? { ...x, isFlashSale: false } : x
                              )
                            );
                            setManualDiscount({});
                          }}
                          className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white "
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className=" flex items-center justify-center">
            <Pagination
              currentPage={flashSaleProductPage}
              totalPages={flashSaleTotalPages}
              setCurrentPage={setFlashSaleProductPage}
              renderPageNumbers={renderPageNumbers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
