import { motion } from "framer-motion";
import ProductCard from "../../../components/ProductCard/ProductCard";
import Pagination from "../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../Utils/Helpers/useRenderPageNumbers";

export default function NewArrivalsGrid({
  filtered,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage
  );
  return (
    <section className="md:py-10 py-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 space-y-10">
        {!filtered.length ? (
          <div className=" text-center md:py-10 py-6 text-gray-500 ">
            <h2>No products found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.04, y: -4 }}
                className="group cursor-pointer transform transition-transform relative"
              >
                <ProductCard item={item} />
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
      </div>
    </section>
  );
}
