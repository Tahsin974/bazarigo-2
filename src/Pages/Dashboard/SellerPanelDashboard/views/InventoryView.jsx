import { motion } from "framer-motion";
import AddBtn from "../../../../components/ui/AddBtn";
export default function InventoryView({ active, inventory, setInventory }) {
  return (
    <div>
      {active === "Inventory" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <AddBtn
                btnHandler={() =>
                  setInventory((prev) =>
                    prev.map((it) => ({ ...it, stock: it.stock + 10 }))
                  )
                }
              >
                + Add 10 to all
              </AddBtn>

              <button
                onClick={() =>
                  setInventory((prev) =>
                    prev.map((it) => ({
                      ...it,
                      stock: Math.max(0, it.stock - 10),
                    }))
                  )
                }
                className="px-3 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white sm:text-base text-xs  rounded"
              >
                - Remove 10 from all
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {inventory.length} items
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
                {inventory.map((it) => (
                  <tr key={it.id}>
                    <td>{it.name}</td>
                    <td>{it.stock}</td>
                    <td>
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            setInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: x.stock + 1 }
                                  : x
                              )
                            )
                          }
                          className="px-3 py-1 border rounded"
                        >
                          +1
                        </button>
                        <button
                          onClick={() =>
                            setInventory((prev) =>
                              prev.map((x) =>
                                x.id === it.id
                                  ? { ...x, stock: Math.max(0, x.stock - 1) }
                                  : x
                              )
                            )
                          }
                          className="px-3 py-1 border rounded"
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
        </motion.div>
      )}
    </div>
  );
}
