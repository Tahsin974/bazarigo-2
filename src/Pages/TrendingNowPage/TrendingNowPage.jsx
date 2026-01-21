import { useState } from "react";
import HeroSection from "./components/HeroSection";
import ControlsSection from "./components/ControlsSection";
import ProductsGrid from "./components/ProductsGrid";
import Pagination from "../../components/ui/Pagination";

import { useRenderPageNumbers } from "../../Utils/Helpers/useRenderPageNumbers";

import Loading from "../../components/Loading/Loading";

import useProducts from "../../Utils/Hooks/useProducts";
import useTrendingProducts from "../../Utils/Hooks/useTrendingProducts";

export default function TrendingNowPage() {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTag, setFilterTag] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  let { products: AllProducts, loading: isPending } = useProducts();
  const { data: trendingProducts = [] } = useTrendingProducts();

  const filteredProducts =
    filterTag === "Trending"
      ? (AllProducts = trendingProducts)
      : AllProducts.filter((product) => {
          const matchesTag =
            filterTag === "All" ||
            (filterTag === "Best Seller" && product.isbestseller) ||
            (filterTag === "Hot" && product.ishot) ||
            (filterTag === "Limited Stock" && product.islimitedstock);

          const matchesSearch = product.product_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          return matchesTag && matchesSearch;
        });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLowHigh")
      return (
        (a.sale_price > 0 ? a.sale_price : a.regular_price) -
        (b.sale_price > 0 ? b.sale_price : b.regular_price)
      );
    if (sortOption === "priceHighLow")
      return (
        (b.sale_price > 0 ? b.sale_price : b.regular_price) -
        (a.sale_price > 0 ? a.sale_price : a.regular_price)
      );
    if (sortOption === "ratingHighLow") {
      // Compute b's rating
      const bRating =
        b.rating > 0
          ? b.rating
          : b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
            : 0;

      // Compute a's rating
      const aRating =
        a.rating > 0
          ? a.rating
          : a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
            : 0;

      return bRating - aRating; // High → Low
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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

  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage,
  );

  return (
    <div className="w-full bg-gray-50 font-sans text-gray-800 ">
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
      <section className="md:py-10 py-6">
        {isPending ? (
          <Loading />
        ) : (
          <div className="container mx-auto px-6">
            <ProductsGrid
              paginatedProducts={paginatedProducts}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                renderPageNumbers={renderPageNumbers}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
