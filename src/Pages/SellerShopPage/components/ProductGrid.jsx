import ProductCard from "../../../components/ProductCard/ProductCard";
import Pagination from "../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../Utils/Helpers/useRenderPageNumbers";
import { motion } from "framer-motion";

export default function ProductGrid({
  filteredProducts,
  displayedProducts,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage
  );
  return (
    <div>
      <section className="py-12 px-6 md:px-12">
        {!filteredProducts?.length ? (
          <div className="max-w-6xl mx-auto text-center h-[50vh]">
            <h1 className="text-gray-400">No Product Found</h1>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <motion.div key={product.id} whileHover={{ scale: 1.03 }}>
                <ProductCard item={product} />
              </motion.div>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            renderPageNumbers={renderPageNumbers}
          />
        )}
      </section>
    </div>
  );
}
