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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <AddBtn btnHandler={openNewProductModal}>
                <PlusCircle /> Add Product
              </AddBtn>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-[#00C853] hover:bg-[#00B34A] text-white  px-4 py-2 rounded shadow ">
                <UploadCloud /> Bulk Upload
                <input
                  ref={fileInputRef}
                  onChange={handleBulkUploadFile}
                  accept=".csv,.xls,.html,.htm"
                  type="file"
                  className="hidden"
                />
              </label>
              <div className="flex gap-2">
                <ExportBtn
                  exportBtnHandler={() => exportProductsExcel(products)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SearchField
                placeholder="Search products..."
                searchValue={productSearch}
                searchValueChange={(e) => {
                  setProductSearch(e.target.value);
                  setProductPage(1);
                }}
              />
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

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">
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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
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

          <div className="mt-4 flex items-center justify-between">
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
