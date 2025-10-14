import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import Pagination from "../../../../components/ui/Pagination";
import { MoreHorizontal } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";

function ProductsView({
  products,
  selected,
  toggleSelect,
  openNewProductModal,
  openEditProductModal,
  setProducts,
  allSelected,
  toggleSelectAll,
  bulkDelete,
  productPage,
  setProductPage,
  productPageSize = 10,
  filteredProducts,

  paginatedProducts,
  productSearch,
  setProductSearch,
  productSort,
  setProductSort,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / productPageSize)
  );
  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons
    const totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / productPageSize)
    );
    const startPage = Math.max(1, productPage - Math.floor(maxVisible / 2));
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
          onClick={() => setProductPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            productPage === i
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
    <div className="space-y-10">
      <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left: SelectAll + Title + small screen Add/Delete buttons */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto order-1  gap-4">
          <div className="flex items-center gap-4">
            <div className="font-medium sm:text-md text-[15px]">
              Products ({products.length})
            </div>
          </div>
          {/* Small screen buttons */}
          <div className="ml-2 lg:hidden flex gap-2">
            <AddBtn btnHandler={openNewProductModal}>Add Product</AddBtn>
            <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
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
          <AddBtn btnHandler={openNewProductModal}>Add Product</AddBtn>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
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
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
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
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      onClick={() => openEditProductModal(p)}
                      className="px-3 py-1 bg-white border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete product?"))
                          setProducts((prev) =>
                            prev.filter((x) => x.id !== p.id)
                          );
                      }}
                      className="px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {paginatedProducts.map((p) => (
          <div key={p.id} className="bg-white rounded shadow-sm p-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {p.images && p.images[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.category}</div>
                  <div className="font-bold text-[#FF0055]">${p.price}</div>
                  <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                </div>
              </div>
              <input
                type="checkbox"
                className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                checked={selected.includes(p.id)}
                onChange={() => toggleSelect(p.id)}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openEditProductModal(p)}
                className="flex-1 px-3 py-2 rounded border bg-[#4F46E5] hover:bg-[#4338CA]  text-white"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  setProducts((s) => s.filter((x) => x.id !== p.id))
                }
                className="px-3 py-2 rounded bg-[#DC2626] hover:bg-[#B91C1C]  text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <div className=" flex items-center justify-center">
        <Pagination
          currentPage={productPage}
          totalPages={totalPages}
          setCurrentPage={setProductPage}
          renderPageNumbers={renderPageNumbers}
        />
      </div>
    </div>
  );
}

export default ProductsView;
