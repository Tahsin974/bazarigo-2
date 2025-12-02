import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscountModal({
  product,
  manualDiscountValue,
  setManualDiscountValue,
  handleSetDiscount,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white rounded shadow overflow-auto max-h-[90vh] relative p-6"
      >
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          <X />
        </button>
        <label className="space-y-2 mt-4">
          <span>Discount for {product.name} (%):</span>
          <div className="flex gap-2">
            <input
              type="number"
              defaultValue={manualDiscountValue}
              onChange={(e) =>
                setManualDiscountValue(
                  e.target.value === "" ? 0 : e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault(); // keyboard up/down disable
                }
              }}
              onWheel={(e) => e.target.blur()}
              placeholder="e.g. 10%"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:border-[#FF0055] focus:ring-2  focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white "
            />
            <button
              onClick={() => handleSetDiscount(product)}
              className="px-3 py-2 bg-[#00C853] hover:bg-[#00B34A] text-white rounded-md "
            >
              Done
            </button>
          </div>
        </label>
      </motion.div>
    </div>
  );
}
