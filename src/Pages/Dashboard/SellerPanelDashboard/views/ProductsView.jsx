import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  MoreHorizontal,
  PlusCircle,
  SquarePen,
  Trash2,
  UploadCloud,
} from "lucide-react";

import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import AddBtn from "../../../../components/ui/AddBtn";
import ExportBtn from "../../../../components/ui/ExportBtn";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

export default function ProductsView({
  active,
  products,
  setProducts,
  productSearch,
  setProductSearch,
  productSort,
  setProductSort,
  productPage,
  setProductPage,
  productPageSize = 10,
  selectedProductIds,
  setSelectedProductIds,
  openNewProductModal,
  openEditProductModal,
  toggleSelectProduct,
  bulkDeleteProducts,
  paginatedProducts,
  filteredProducts,
  setDisplayProducts,
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
    <div>
      {active === "Products" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap lg:items-center lg:justify-between gap-4 mb-4">
            {/* Left: Action buttons (Add, Bulk Upload, Export) */}
            <div className="flex items-center justify-between w-full md:w-auto order-1 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <AddBtn btnHandler={openNewProductModal}>
                  <PlusCircle /> Add Product
                </AddBtn>

                <DeleteAllBtn
                  selected={selectedProductIds}
                  bulkDelete={bulkDeleteProducts}
                />
              </div>
            </div>

            {/* Right: Search + Sort */}
            <div className="order-2 md:order-2  flex flex-wrap   gap-3 items-center">
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
              <div className="xl:hidden lg:hidden md:hidden flex  order-2"></div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* head */}
              <thead className="text-black">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      onChange={(e) =>
                        setSelectedProductIds(
                          e.target.checked ? products.map((p) => p.id) : []
                        )
                      }
                      checked={
                        selectedProductIds.length === products.length &&
                        products.length > 0
                      }
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
                        checked={selectedProductIds.includes(p.id)}
                        onChange={() => toggleSelectProduct(p.id)}
                      />
                    </td>
                    <td>{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">৳{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          // onClick={() => openPreviewModal(p)}
                          className=" px-3 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-900 "
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="px-3 py-2 bg-orange-100 text-[#E6612A] hover:bg-orange-400 hover:text-white rounded"
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
                          className=" bg-red-100 hover:bg-red-600 text-red-600 rounded  px-3 py-2  hover:text-white "
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

          <div className="flex items-center justify-center gap-2">
            <Pagination
              currentPage={productPage}
              totalPages={totalPages}
              setCurrentPage={setProductPage}
              renderPageNumbers={renderPageNumbers}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
