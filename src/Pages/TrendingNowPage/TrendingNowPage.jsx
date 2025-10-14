import { useState } from "react";
import HeroSection from "./components/HeroSection";
import ControlsSection from "./components/ControlsSection";
import ProductsGrid from "./components/ProductsGrid";
import Pagination from "../../components/ui/Pagination";
import { motion } from "framer-motion";

import { MoreHorizontal } from "lucide-react";
import { sampleProducts } from "../../Utils/Helpers/Helpers";

export default function TrendingNowPage() {
  const allProducts = sampleProducts();

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTag, setFilterTag] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = allProducts.filter((product) => {
    const matchesTag =
      filterTag === "All" ||
      (filterTag === "Best Seller" && product.isBestSeller) ||
      (filterTag === "Hot" && product.isHot) ||
      (filterTag === "Trending" && product.isTrending) ||
      (filterTag === "Limited Stock" && product.isLimitedStock) ||
      (filterTag === "Exclusive" && product.isExclusive);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLowHigh") return a.price - b.price;
    if (sortOption === "priceHighLow") return b.price - a.price;
    if (sortOption === "ratingHighLow") return b.rating - a.rating;

    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

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
    <div className="w-full bg-gray-50 font-sans text-gray-800">
      <HeroSection />
      <ControlsSection
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <section className="py-12">
        <div className="container mx-auto px-6">
          <ProductsGrid
            paginatedProducts={paginatedProducts}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            renderPageNumbers={renderPageNumbers}
          />
        </div>
      </section>
    </div>
  );
}
