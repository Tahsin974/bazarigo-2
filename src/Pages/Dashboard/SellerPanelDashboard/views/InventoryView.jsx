import { motion } from "framer-motion";
import AddBtn from "../../../../components/ui/AddBtn";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import Pagination from "../../../../components/ui/Pagination";
import SelectField from "../../../../components/ui/SelectField";
import SearchField from "../../../../components/ui/SearchField";
import { Filter, Layers, Minus, Package, Plus } from "lucide-react";
export default function InventoryView({
  active,
  setInventory,
  setDisplayInventory,
  inventorySearch,
  setInventorySearch,
  inventorySort,
  setInventorySort,
  inventoryPage,
  setInventoryPage,
  inventoryPageSize,
  filteredInventory,
  paginatedInventory,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / inventoryPageSize)
  );

  const renderPageNumbers = useRenderPageNumbers(
    inventoryPage,
    totalPages,
    setInventoryPage
  );

  // const updateAllStocks = async (change) => {
  //   try {
  //     const response = await axios.patch("/inventory", { change });
  //     alert(response.data.message);

  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update stocks");
  //   }
  // };

  //   const updateSingleStock = async (id, change) => {
  //   try {
  //     const response = await axios.patch("/inventory", { change, productId: id });
  //     alert(response.data.message);

  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update stock");
  //   }
  // };

  // Function to increase stock
  const handleIncreaseStock = (productId, variantIndex) => {
    setInventory((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newVariants = p.extras.variants.map((v, i) =>
            i === variantIndex ? { ...v, stock: v.stock + 1 } : v
          );
          return { ...p, extras: { ...p.extras, variants: newVariants } };
        }
        return p;
      })
    );

    setDisplayInventory((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newVariants = p.extras.variants.map((v, i) =>
            i === variantIndex ? { ...v, stock: v.stock + 1 } : v
          );
          return { ...p, extras: { ...p.extras, variants: newVariants } };
        }
        return p;
      })
    );
  };

  // Function to decrease stock
  const handleDecreaseStock = (productId, variantIndex) => {
    setInventory((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newVariants = p.extras.variants.map((v, i) =>
            i === variantIndex ? { ...v, stock: Math.max(v.stock - 1, 0) } : v
          );
          return { ...p, extras: { ...p.extras, variants: newVariants } };
        }
        return p;
      })
    );

    setDisplayInventory((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newVariants = p.extras.variants.map((v, i) =>
            i === variantIndex ? { ...v, stock: Math.max(v.stock - 1, 0) } : v
          );
          return { ...p, extras: { ...p.extras, variants: newVariants } };
        }
        return p;
      })
    );
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
                  <Filter
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
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

            <div className="grid gap-5">
              {paginatedInventory.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex items-center justify-between border-b pb-3 mb-3">
                    <div>
                      <h2 className="text-lg font-semibold">{p.name}</h2>
                      <p className="text-sm text-gray-600">
                        {p.category} → {p.subcategory}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        Total Stock: {calculateTotalStock(p)}
                      </p>
                    </div>
                  </div>

                  {p.extras?.variants && p.extras.variants.length > 0 ? (
                    <div className="overflow-x-auto bg-white rounded-box shadow-sm">
                      <table className="table text-center w-full">
                        <thead className="text-black">
                          <tr>
                            {/* Dynamic columns: get all keys except stock and price */}
                            {Object.keys(p.extras.variants[0])
                              .filter((k) => k !== "stock" && k !== "price")
                              .map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            <th>Price (৳)</th>
                            <th>Stock</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.extras.variants.map((v, i) => (
                            <tr key={i}>
                              {Object.keys(v)
                                .filter((k) => k !== "stock" && k !== "price")
                                .map((key) => (
                                  <td key={key}>{v[key]}</td>
                                ))}
                              <td>{v.price}</td>
                              <td>{v.stock}</td>
                              <td className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleDecreaseStock(p.id, i)}
                                  className="p-1 rounded bg-red-100 hover:bg-red-200"
                                >
                                  <Minus size={14} className="text-red-600" />
                                </button>
                                <button
                                  onClick={() => handleIncreaseStock(p.id, i)}
                                  className="p-1 rounded bg-green-100 hover:bg-green-200"
                                >
                                  <Plus size={14} className="text-green-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No variants found.</p>
                  )}
                </div>
              ))}
            </div>
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
