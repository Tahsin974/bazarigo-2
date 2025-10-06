import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import InfiniteControls from "./components/Controls/InfiniteControls";
import Pagination from "../../components/ui/Pagination";

// Final compiled, responsive Categories page
// Features:
// - Desktop sidebar with expandable subcategories
// - Mobile slide-out sidebar
// - Category filtering
// - Sort (Newest, Price low/high, Rating)
// - Grid / List view toggle
// - Toggle between Pagination and Infinite Scroll
// - Pagination (with smooth scroll)
// - Infinite scroll + optional "Load more" fallback
// - Loading spinner + skeleton placeholders during load

export default function CategoriesPage() {
  // State & logic ...existing code...
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [mode, setMode] = useState("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [autoLoad, setAutoLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const categories = [
    {
      name: "Electronics",
      sub: ["Laptops", "Smartphones", "Audio", "Accessories"],
    },
    { name: "Fashion", sub: ["Men", "Women", "Shoes", "Bags"] },
    {
      name: "Groceries",
      sub: ["Beverages", "Snacks", "Fresh Produce", "Household"],
    },

    {
      name: "Health & Beauty",
      sub: ["Furniture", "Appliances", "Cookware", "Decor"],
    },
    {
      name: "Home & Living",
      sub: ["Furniture", "Appliances", "Cookware", "Decor"],
    },

    { name: "Sports", sub: ["Fitness", "Outdoor", "Cycling", "Accessories"] },
  ];
  const products = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `$${((i + 1) * 7).toFixed(2)}`,
    rating: Math.floor(Math.random() * 5) + 1,
    category:
      i % 3 === 0 ? "Electronics" : i % 3 === 1 ? "Fashion" : "Home & Kitchen",
    img: `https://placehold.co/600x600/${
      i % 3 === 0 ? "007BFF" : i % 3 === 1 ? "FF0055" : "F39C12"
    }/ffffff?text=Product+${i + 1}`,
    createdAt: Date.now() - i * 1000 * 60 * 60 * 24,
  }));
  const filteredProducts =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Price: Low to High")
      return (
        parseFloat(a.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(b.price.replace(/[^0-9.-]+/g, ""))
      );
    if (sortOption === "Price: High to Low")
      return (
        parseFloat(b.price.replace(/[^0-9.-]+/g, "")) -
        parseFloat(a.price.replace(/[^0-9.-]+/g, ""))
      );
    if (sortOption === "Rating") return b.rating - a.rating;
    return b.createdAt - a.createdAt;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const loadMore = async () => {
    if (loading) return;
    if (visibleCount >= sortedProducts.length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setVisibleCount((v) => Math.min(sortedProducts.length, v + itemsPerPage));
    setLoading(false);
  };
  useEffect(() => {
    if (mode !== "infinite" || !autoLoad) return;
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY + 120 >=
        document.documentElement.offsetHeight;
      if (nearBottom && !loading) loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, autoLoad, visibleCount, loading, sortedProducts.length]);
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [activeCategory, sortOption, mode]);
  const productsToRender =
    mode === "pagination" ? pageProducts : visibleProducts;
  // Main layout

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
    <div className="w-full bg-white min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Shop by Category
          </h1>
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-600">Mode:</span>
            <button
              onClick={() => setMode("pagination")}
              className={`px-3 py-2 rounded-lg ${
                mode === "pagination"
                  ? "bg-[#FF0055] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Pagination
            </button>
            <button
              onClick={() => setMode("infinite")}
              className={`px-3 py-2 rounded-lg ${
                mode === "infinite"
                  ? "bg-[#FF0055] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Infinite
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortOption={sortOption}
            setSortOption={setSortOption}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            autoLoad={autoLoad}
            setAutoLoad={setAutoLoad}
          />
          {/* Products + controls */}
          <section className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">Showing</div>
                <div className="font-medium text-gray-800">
                  {mode === "pagination"
                    ? `${startIndex + 1} - ${Math.min(
                        startIndex + itemsPerPage,
                        sortedProducts.length
                      )}`
                    : `1 - ${Math.min(visibleCount, sortedProducts.length)}`}
                </div>
                <div className="text-sm text-gray-600">
                  of {sortedProducts.length}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative inline-block text-left z-10">
                  <div className="relative inline-flex items-center">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer"
                    >
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-[#FF0055] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-[#FF0055] text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    List
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <label className="flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-xs rounded-sm"
                      checked={autoLoad}
                      onChange={() => setAutoLoad(!autoLoad)}
                    />
                    <span>Auto load</span>
                  </label>
                </div>
              </div>
            </div>
            {/* Products grid / list */}
            <ProductGrid
              products={productsToRender}
              viewMode={viewMode}
              loading={loading}
              itemsPerPage={itemsPerPage}
              sortedProducts={sortedProducts}
            />
            {/* Controls under grid */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Pagination controls */}
              {mode === "pagination" && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  renderPageNumbers={renderPageNumbers}
                />
              )}
              {/* Infinite / Load more controls */}
              {mode === "infinite" && (
                <InfiniteControls
                  autoLoad={autoLoad}
                  visibleCount={visibleCount}
                  sortedProducts={sortedProducts}
                  loading={loading}
                  loadMore={loadMore}
                />
              )}
              {/* Mode switch for small screens */}
              <div className="sm:hidden mt-2">
                <div className="flex items-center gap-2 justify-center">
                  <button
                    onClick={() =>
                      setMode(mode === "pagination" ? "infinite" : "pagination")
                    }
                    className="text-sm underline text-gray-600"
                  >
                    Switch to{" "}
                    {mode === "pagination" ? "Infinite" : "Pagination"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
