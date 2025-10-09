import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import ProductModal from "../components/ProductModal/ProductModal";
import DeleteAllBtn from "../../../../components/ui/DeleteAllBtn";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import AddBtn from "../../../../components/ui/AddBtn";
import ExportBtn from "../../../../components/ui/ExportBtn";

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
  productModalOpen,
  setProductModalOpen,
  productForm,
  setProductForm,
  editingProduct,
  fileInputRef,
  handleBulkUploadFile,
  openNewProductModal,
  openEditProductModal,
  saveProduct,
  toggleSelectProduct,
  bulkDeleteProducts,
  paginatedProducts,
  filteredProducts,
  exportProductsExcel,
  categorySchemas,
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

                <label className="btn  border-none rounded shadow bg-[#00C853] hover:bg-[#00B34A] text-white sm:text-base text-xs">
                  <UploadCloud /> Bulk Upload
                  <input
                    ref={fileInputRef}
                    onChange={handleBulkUploadFile}
                    accept=".csv,.xls,.html,.htm"
                    type="file"
                    className="hidden"
                  />
                </label>

                <div className="xl:flex lg:flex md:flex hidden ">
                  <ExportBtn
                    exportBtnHandler={() => exportProductsExcel(products)}
                  />
                </div>
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
              <div className="xl:hidden lg:hidden md:hidden flex  order-2">
                <ExportBtn
                  exportBtnHandler={() => exportProductsExcel(products)}
                />
              </div>
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
                    <td className="px-4 py-3">${p.price}</td>
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
                          className="px-3 py-1 bg-white border rounded"
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

          <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
            <div>
              <DeleteAllBtn
                selected={selectedProductIds}
                bulkDelete={bulkDeleteProducts}
              />
            </div>

            <div className="flex items-center gap-2">
              <Pagination
                currentPage={productPage}
                totalPages={totalPages}
                setCurrentPage={setProductPage}
                renderPageNumbers={renderPageNumbers}
              />
            </div>
          </div>

          {/* Product modal */}
          <ProductModal
            productModalOpen={productModalOpen}
            setProductModalOpen={setProductModalOpen}
            editingProduct={editingProduct}
            productForm={productForm}
            setProductForm={setProductForm}
            saveProduct={saveProduct}
            categorySchemas={categorySchemas}
          />
        </motion.div>
      )}
    </div>
  );
}
