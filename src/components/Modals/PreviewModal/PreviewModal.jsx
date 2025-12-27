import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewModal({ product, onClose }) {
  const variants = product.extras?.variants.map(({ id, ...rest }) => rest);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Product Details </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>
        <div className="bg-white rounded-lg shadow p-5 my-5">
          <div className="flex md:flex-row flex-col justify-center items-center md:justify-between border-b pb-3 mb-3 gap-3">
            <div className="space-y-2 md:text-left text-center">
              <h2 className="text-lg font-semibold">{product.product_name}</h2>
              <p className="text-sm text-gray-600 ">
                <span className="font-bold">
                  {product.category} → {product.subcategory}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-bold">
                  Store Name: {product.seller_store_name}
                </span>
              </p>
            </div>
            <div className="text-right">
              <h5 className="text-sm font-medium text-gray-700">
                Total Stock: {product.stock}
              </h5>
            </div>
          </div>

          {variants && variants.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-box shadow-sm">
              <table className="table text-center w-full">
                <thead className="text-black">
                  <tr>
                    {/* Dynamic columns: get all keys except stock and price */}
                    {Object.keys(variants[0]).map((key) => (
                      <th key={key} className="capitalize">
                        {key.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i}>
                      {Object.keys(v).map((key) => (
                        <td key={key}>{v[key].toLocaleString("en-IN")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No variants found.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
