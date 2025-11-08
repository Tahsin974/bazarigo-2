import { useState } from "react";
import HeroSection from "./components/HeroSection";
import ControlsSection from "./components/ControlsSection";
import ProductsGrid from "./components/ProductsGrid";
import Pagination from "../../components/ui/Pagination";
import { motion } from "framer-motion";

import { useRenderPageNumbers } from "../../Utils/Hooks/useRenderPageNumbers";
import useProducts from "../../Utils/Hooks/useProducts";

export default function TrendingNowPage() {
  const { products: allProducts } = useProducts();

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
            renderPageNumbers={useRenderPageNumbers(
              currentPage,
              totalPages,
              setCurrentPage
            )}
          />
        </div>
      </section>
    </div>
  );
}
