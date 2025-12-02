import { motion } from "framer-motion";
import AddBtn from "../../../../components/ui/AddBtn";

import Pagination from "../../../../components/ui/Pagination";
import SelectField from "../../../../components/ui/SelectField";
import SearchField from "../../../../components/ui/SearchField";
import { Layers, Minus, Package, Plus } from "lucide-react";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAuth from "../../../../Utils/Hooks/useAuth";
import useNotifications from "../../../../Utils/Hooks/useNotifications";
export default function InventoryView({
  active,
  refetch,
  refetchProducts,
  inventorySearch,
  setInventorySearch,
  inventorySort,
  setInventorySort,
  inventoryPage,
  setInventoryPage,
  inventoryPageSize,
  filteredInventory,
  paginatedInventory,
  inventory,
}) {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / inventoryPageSize)
  );
  const { refetchNotifications } = useNotifications();

  const renderPageNumbers = useRenderPageNumbers(
    inventoryPage,
    totalPages,
    setInventoryPage
  );

  const updateAllStocks = async (change) => {
    try {
      const res = await axiosPublic.patch(
        `/inventory/all-variants/${user.id}`,
        {
          change,
        }
      );

      if (res.data.updated) {
        refetch();
        refetchProducts();
        refetchNotifications();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to update all stocks",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const updateVariantStock = async (productId, variantIndex, change) => {
    try {
      const res = await axiosPublic.patch(`/inventory/${user.id}`, {
        productId,
        variantIndex,
        change,
      });

      if (res.data.updatedCount > 0) {
        refetch();
        refetchProducts();
        refetchNotifications();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Calculate total stock
  const calculateTotalStock = (product) => {
    if (!product.extras?.variants || product.extras.variants.length === 0)
      return 0;
    return product.extras.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  };

  return (
    <div>
      {active === "Inventory" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Layers className="text-indigo-600" /> Inventory Management
              </h1>
              <div className="flex gap-3 items-center mt-3 md:mt-0">
                <SearchField
                  placeholder="Search products..."
                  searchValue={inventorySearch}
                  searchValueChange={(e) => {
                    setInventorySearch(e.target.value);
                    setInventoryPage(1);
                  }}
                />

                <div className="relative">
                  <SelectField
                    selectValue={inventorySort}
                    selectValueChange={(e) => setInventorySort(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="stock">Sort by Stock</option>
                  </SelectField>
                </div>
              </div>
            </div>

            {inventory?.length ? (
              <div className="grid gap-5">
                {paginatedInventory.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {p.product_name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {p.category} → {p.subcategory}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          Total Stock: {calculateTotalStock(p)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAllStocks(-10)}
                          className="px-2 py-1 text-sm rounded bg-red-100 hover:bg-red-200 text-red-600"
                        >
                          Decrease by 10
                        </button>
                        <button
                          onClick={() => updateAllStocks(+10)}
                          className="px-2 py-1 text-sm rounded bg-green-100 hover:bg-green-200 text-green-600"
                        >
                          Increase by 10
                        </button>
                      </div>
                    </div>

                    {p.extras?.variants && p.extras.variants.length > 0 ? (
                      <div className="overflow-x-auto bg-white rounded-box shadow-sm">
                        <table className="table text-center w-full">
                          <thead className="text-black">
                            <tr>
                              {Object.keys(p.extras.variants[0])
                                .filter(
                                  (k) =>
                                    k !== "stock" &&
                                    k !== "sale_price" &&
                                    k !== "regular_price"
                                )
                                .map((key) => (
                                  <th key={key} className="capitalize">
                                    {key}
                                  </th>
                                ))}
                              <th>Regular Price (৳)</th>
                              <th>Sale Price (৳)</th>
                              <th>Stock</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.extras.variants.map((v, i) => (
                              <tr key={i}>
                                {Object.keys(v)
                                  .filter(
                                    (k) =>
                                      k !== "stock" &&
                                      k !== "sale_price" &&
                                      k !== "regular_price"
                                  )
                                  .map((key) => (
                                    <td key={key}>{v[key]}</td>
                                  ))}
                                <td>{v.regular_price}</td>
                                <td>{v.sale_price}</td>
                                <td>{v.stock}</td>
                                <td className="flex justify-center items-center gap-2">
                                  <button
                                    onClick={() =>
                                      updateVariantStock(p.id, i, -1)
                                    }
                                    className="p-1 rounded bg-red-100 hover:bg-red-200"
                                  >
                                    <Minus size={14} className="text-red-600" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateVariantStock(p.id, i, +1)
                                    }
                                    className="p-1 rounded bg-green-100 hover:bg-green-200"
                                  >
                                    <Plus
                                      size={14}
                                      className="text-green-600"
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No variants found.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white py-20 text-gray-400">
                No Products Found
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Pagination
              currentPage={inventoryPage}
              totalPages={totalPages}
              setCurrentPage={setInventoryPage}
              renderPageNumbers={renderPageNumbers}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
