import { motion } from "framer-motion";
import ProductCard from "../../../components/ProductCard/ProductCard";

export default function ProductsGrid({
  paginatedProducts,
  containerVariants,
  itemVariants,
}) {
  if (paginatedProducts.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg font-medium py-10">
        No products found matching your search.
      </p>
    );
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {paginatedProducts.map((product, index) => (
        <motion.div key={index} variants={itemVariants}>
          <ProductCard item={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
