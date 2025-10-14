import SortDropdown from "./components/SortDropdown";
import NewArrivalsGrid from "./components/NewArrivalsGrid";
import { motion } from "framer-motion";
import { sampleProducts } from "../../Utils/Helpers/Helpers";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

const allProducts = sampleProducts();

export default function JustArrivedPage() {
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // Filter logic
  const filtered = allProducts.filter(
    (prod) => prod.isNew && prod.isBestSeller
  );
  console.log(filtered);

  const sortedProducts = [...filtered].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Best Seller") return b.isBestSeller - a.isBestSeller;
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxVisible - 1) {
      if (currentPage < totalPages / 2) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    if (start > 1)
      pageNumbers.push(
        <MoreHorizontal
          key="start-ellipsis"
          className="w-5 h-5 text-gray-400"
        />
      );

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            currentPage === i
              ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055]"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </motion.div>
      );
    }

    if (end < totalPages)
      pageNumbers.push(
        <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
      );

    return pageNumbers;
  };

  return (
    <div>
      <section className="py-8">
        <div className="container mx-auto flex flex-col md:flex-row gap-4 justify-between items-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Just Arrived
          </h1>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </section>
      <NewArrivalsGrid
        filtered={displayedProducts}
        renderPageNumbers={renderPageNumbers}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
