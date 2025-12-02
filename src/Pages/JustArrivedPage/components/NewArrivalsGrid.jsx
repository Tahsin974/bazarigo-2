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
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center  mb-10 ">
          Explore What's New
        </h2>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          renderPageNumbers={useRenderPageNumbers(
            currentPage,
            totalPages,
            setCurrentPage
          )}
        />
      </div>
    </section>
  );
}
