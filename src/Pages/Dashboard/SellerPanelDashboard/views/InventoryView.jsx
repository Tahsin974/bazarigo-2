import { motion } from "framer-motion";
export default function InventoryView({ active, inventory, setInventory }) {
  return (
    <div>
      {active === "Inventory" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setInventory((prev) =>
                    prev.map((it) => ({ ...it, stock: it.stock + 10 }))
                  )
                }
                className="px-3 py-2 bg-[#FF0055] text-white rounded"
              >
                + Add 10 to all
              </button>
              <button
                onClick={() =>
                  setInventory((prev) =>
                    prev.map((it) => ({
                      ...it,
                      stock: Math.max(0, it.stock - 10),
                    }))
                  )
                }
                className="px-3 py-2 bg-white border rounded"
              >
                - Remove 10 from all
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {inventory.length} items
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="px-4 py-2">{it.name}</td>
                    <td className="px-4 py-2">{it.stock}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
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
