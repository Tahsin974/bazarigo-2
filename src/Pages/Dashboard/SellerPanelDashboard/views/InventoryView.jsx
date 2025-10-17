import { motion } from "framer-motion";
import AddBtn from "../../../../components/ui/AddBtn";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";
import Pagination from "../../../../components/ui/Pagination";
import SelectField from "../../../../components/ui/SelectField";
import SearchField from "../../../../components/ui/SearchField";
export default function InventoryView({
  active,
  inventory,
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
  return (
    <div>
      {active === "Inventory" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {inventory.length} items
              </div>
              <div className="flex items-center gap-2">
                <AddBtn
                  btnHandler={() => {
                    setInventory((prev) =>
                      prev.map((it) => ({ ...it, stock: it.stock + 10 }))
                    );
                    setDisplayInventory((prev) =>
                      prev.map((it) => ({ ...it, stock: it.stock + 10 }))
                    );
                  }}
                >
                  + Add 10 to all
                </AddBtn>

                <button
                  onClick={() => {
                    setInventory((prev) =>
                      prev.map((it) => ({
                        ...it,
                        stock: Math.max(0, it.stock - 10),
                      }))
                    );
                    setDisplayInventory((prev) =>
                      prev.map((it) => ({
                        ...it,
                        stock: Math.max(0, it.stock - 10),
                      }))
                    );
                  }}
                  className="px-3 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white sm:text-base text-[14px]  rounded"
                >
                  - Remove 10 from all
                </button>
              </div>
            </div>
            <div className="  flex flex-wrap   gap-3 items-center">
              <div className="w-full order-3 xl:w-auto lg:w-auto md:w-auto xl:order-1 lg:order-1 md:order-1 ">
                <SearchField
                  placeholder="Search products..."
                  searchValue={inventorySearch}
                  searchValueChange={(e) => {
                    setInventorySearch(e.target.value);
                    setInventoryPage(1);
                  }}
                />
              </div>
              <div className="xl:order-2 lg:order-2 md:order-2 order-1 ">
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

          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* head */}
              <thead className="text-black">
                <tr>
                  <th>Item</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="">
                {paginatedInventory.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.stock}</td>
                    <td>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: x.stock + 1 }
                                  : x
                              )
                            );
                            setDisplayInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: x.stock + 1 }
                                  : x
                              )
                            );
                            setInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: x.stock + 1 }
                                  : x
                              )
                            );
                          }}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => {
                            setInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: Math.max(0, x.stock - 1) }
                                  : x
                              )
                            );
                            setDisplayInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: Math.max(0, x.stock - 1) }
                                  : x
                              )
                            );
                          }}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          -1
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
