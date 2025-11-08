import React from "react";
import SelectAllCheckbox from "../../../../components/ui/SelectAllCheckbox";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import AddBtn from "../../../../components/ui/AddBtn";
import Pagination from "../../../../components/ui/Pagination";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import { motion } from "framer-motion";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

function ProductsView({
  products,
  selected,
  toggleSelect,
  openNewProductModal,
  openEditProductModal,
  setProducts,
  setDisplayProducts,
  allSelected,
  toggleSelectAll,
  bulkDelete,
  productPage,
  setProductPage,
  productPageSize = 10,
  filteredProducts,
  openPreviewModal,
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
  const renderPageNumbers = useRenderPageNumbers(
    productPage,
    totalPages,
    setProductPage
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-3">
        {/* Left: SelectAll + Title + small screen Add/Delete buttons */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto order-1  gap-4">
          <div className="flex items-center gap-4">
            <div className="font-medium sm:text-md text-[15px]">
              Products {!products?.length ? "" : <>({products.length})</>}
            </div>
          </div>
          {/* Small screen buttons */}
          <div className="ml-2 lg:hidden flex gap-2">
            <AddBtn btnHandler={openNewProductModal}>
              <PlusCircle />
              Add Product
            </AddBtn>
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

              <option value="rating">Sort by Rating</option>
            </SelectField>
          </div>
        </div>

        {/* Right: Buttons on large screens */}
        <div className="hidden lg:flex gap-2 order-3 ">
          <AddBtn btnHandler={openNewProductModal}>
            <PlusCircle /> Add Product
          </AddBtn>
          <DeleteAllBtn selected={selected} bulkDelete={bulkDelete} />
        </div>
      </div>
      {products.length === 0 ? (
        <div>
          <div className="flex flex-col items-center justify-center py-20">
            products not found
          </div>
        </div>
      ) : products.length === null ? (
        <div>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-xl"></span>
          </div>
        </div>
      ) : (
        <>
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
                  <th>Product Name</th>
                  <th>Store Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>

                    <td>
                      <div className="flex items-center gap-4 text-start">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={`http://localhost:3000${p.images[0]}`}
                              alt={p.name}
                            />
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold">
                            {p.product_name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {" "}
                      <span className="font-semibold">Rahim Ghosh</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold">
                        ৳{p.sale_price.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">{p.stock}</span>
                    </td>
                    <td className="px-4 py-3 ">
                      <span className="font-semibold">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 ">
                      <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-1">
                        <Star
                          size={15}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="font-semibold">{p.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openPreviewModal(p)}
                          className=" px-3 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900 "
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="px-3 py-2 bg-orange-100 text-[#E6612A] hover:bg-orange-400 hover:text-white rounded cursor-pointer"
                        >
                          <SquarePen size={20} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete product?"))
                              setProducts((prev) =>
                                prev.filter((x) => x.id !== p.id)
                              );
                            setDisplayProducts((prev) =>
                              prev.filter((x) => x.id !== p.id)
                            );
                          }}
                          className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white 
                          cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
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
              renderPageNumbers={renderPageNumbers}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductsView;
