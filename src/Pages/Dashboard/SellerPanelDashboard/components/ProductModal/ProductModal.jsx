import { AnimatePresence, motion } from "framer-motion";
import { Upload, X } from "lucide-react";
export default function ProductModal({
  productModalOpen,
  setProductModalOpen,
  editingProduct,
  productForm,
  setProductForm,
  saveProduct,
  categorySchemas,
}) {
  return (
    <div>
      <AnimatePresence>
        {productModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40  p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-white rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    {Object.keys(categorySchemas).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer  px-3 py-2 rounded">
                    <Upload size={16} /> Change photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const urls = files.map((f) => URL.createObjectURL(f));
                        setProductForm((prev) => ({
                          ...prev,
                          images: [...(prev.images || []), ...urls],
                        }));
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {(productForm.images || []).map((src, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-20 bg-gray-100 rounded overflow-hidden"
                      >
                        <img
                          src={src}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {(
                  categorySchemas[productForm.category] ||
                  categorySchemas.Default
                ).map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        value={productForm[field.key] || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            [field.key]: e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2 h-24"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={productForm[field.key] || ""}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            [field.key]:
                              field.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                        className="w-full border rounded px-3 py-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border rounded "
                >
                  Cancel
                </button>
                <button
                  onClick={saveProduct}
                  className="px-4 py-2 bg-[#FF0055] text-white rounded"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
