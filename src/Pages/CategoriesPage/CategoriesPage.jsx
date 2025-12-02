import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { motion } from "framer-motion";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import InfiniteControls from "./components/Controls/InfiniteControls";
import Pagination from "../../components/ui/Pagination";
import { useParams } from "react-router";

import useProducts from "../../Utils/Hooks/useProducts";
import { useRenderPageNumbers } from "../../Utils/Helpers/useRenderPageNumbers";

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
  const { categoryName } = useParams();
  const [activeCategory, setActiveCategory] = useState(
    categoryName || "All Products"
  );
  const [openDropdown, setOpenDropdown] = useState(null);

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

      sub: [
        "Accessories",
        "Audio & Headphones",
        "Cameras & Photography",
        "Gaming Consoles",
        "Laptops & Computers",
        "Mobile Phones",
        "TV & Home Theater",
        "Wearables",
      ],
    },
    {
      name: "Fashion",

      sub: [
        "Accessories",
        "Bags & Backpacks",
        "Ethnic & Traditional Wear",
        "Footwear",
        "Kid’s Clothing",
        "Men’s Clothing",
        "Watches",
        "Women’s Clothing",
      ],
    },
    {
      name: "Groceries",

      sub: [
        "Accessories",
        "Beverages",
        "Cooking Essentials",
        "Dairy & Eggs",
        "Fresh Fruits & Vegetables",
        "Frozen Foods",
        "Meat & Seafood",
        "Packaged & Snacks",
      ],
    },
    {
      name: "Health & Beauty",

      sub: [
        "Accessories",
        "Fragrances",
        "Haircare",
        "Makeup & Cosmetics",
        "Skincare",
        "Vitamins & Supplements",
      ],
    },
    {
      name: "Home & Living",

      sub: [
        "Accessories",
        "Bedding & Bath",
        "Cleaning Supplies",
        "Furniture",
        "Home Decor",
        "Kitchen & Dining",
        "Lighting",
        "Storage & Organization",
      ],
    },
    {
      name: "Sports",

      sub: [
        "Accessories",
        "Cycling & Scooters",
        "Gym & Fitness Equipment",
        "Outdoor Sports",
        "Sportswear & Footwear",
        "Water Sports",
      ],
    },
  ];

  const { products } = useProducts();
  const filteredProducts =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.subcategory === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
    if (sortOption === "Rating") return b.rating - a.rating;
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
  useEffect(() => {
    if (categoryName) {
      setActiveCategory(categoryName);
    }
  }, [categoryName]);
  const productsToRender =
    mode === "pagination" ? pageProducts : visibleProducts;
  // Main layout

  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage
  );
  return (
    <div className="w-full bg-gray-50 text-gray-800 min-h-screen py-12">
      <div className="container mx-auto xl:px-6 lg:px-6  px-4 lg:px-12">
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
