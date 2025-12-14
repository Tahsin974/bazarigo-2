import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductGrid({
  products,
  viewMode,
  loading,
  itemsPerPage,
  sortedProducts,
}) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          : "space-y-6"
      }
    >
      {products.length === 0 && (
        <div className="col-span-full text-center items-center flex justify-center text-gray-500 py-8 bg-white h-screen">
          No products found
        </div>
      )}

      {products.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ scale: 1.02 }}
          className={`cursor-pointer `}
        >
          <ProductCard product={product} viewMode={viewMode} />
        </motion.div>
      ))}

      {/* skeleton placeholders while loading (for infinite load) */}
      {loading &&
        Array.from({
          length: Math.min(itemsPerPage, sortedProducts.length),
        }).map((_, i) => (
          <div key={`skeleton-${i}`} className="animate-pulse">
            <div className="bg-gray-100 rounded-2xl h-48" />
          </div>
        ))}
    </div>
  );
}
