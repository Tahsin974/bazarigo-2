import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ProductGrid from "./components/ProductGrid/ProductGrid";
import { ChevronDown } from "lucide-react";
import InfiniteControls from "./components/Controls/InfiniteControls";
import Pagination from "../../components/ui/Pagination";
import { useParams } from "react-router";

import useProducts from "../../Utils/Hooks/useProducts";
import { useRenderPageNumbers } from "../../Utils/Helpers/useRenderPageNumbers";
import { useLocation } from "react-router";
import { motion } from "framer-motion";

export default function CategoriesPage() {
  // State & logic ...existing code...
  const { categoryName } = useParams();

  // const [activeCategory, setActiveCategory] = useState(
  //   categoryName || "All Products"
  // );
  const [activeCategory, setActiveCategory] = useState({
    main: categoryName || "All Products",
    sub: null,
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  const [sortOption, setSortOption] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [mode, setMode] = useState("pagination");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

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
        "Frozen Foods",
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
        "Kitchen Appliances",
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
    {
      name: "Pet Supplies",

      sub: [
        "Accessories",
        "Pet Food",
        "Pet Grooming",
        "Pet Health",
        "Pet Clothing",
        "Pet Training & Safety",
      ],
    },
  ];

  const { products } = useProducts();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const queryProduct = params.get("product"); // encoded product ID
  const subcategory = params.get("subcategory");

  const [highlightedProduct, setHighlightedProduct] = useState(
    queryProduct ? queryProduct : null
  );

  const filteredProducts = products.filter((product) => {
    // Check category match
    const matchesTag =
      activeCategory.main === "All Products" ||
      (product.category === activeCategory.main &&
        product.subcategory === activeCategory.sub);

    // Check product highlight / search safely
    const matchesSearch =
      highlightedProduct && product.product_name
        ? product.product_name
            .toLowerCase()
            .includes(highlightedProduct.toLowerCase())
        : true; // যদি highlightedProduct না থাকে, সব match হবে

    return matchesTag && matchesSearch;
  });

  // const filteredProducts =
  //   activeCategory === "All Products"
  //     ? products
  //     : products.filter((p) => p.subcategory === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Price: Low to High")
      return (
        (a.sale_price > 0 ? a.sale_price : a.regular_price) -
        (b.sale_price > 0 ? b.sale_price : b.regular_price)
      );
    if (sortOption === "Price: High to Low")
      return (
        (b.sale_price > 0 ? b.sale_price : b.regular_price) -
        (a.sale_price > 0 ? a.sale_price : a.regular_price)
      );
    if (sortOption === "Rating") {
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
  console.log(totalPages);

  const loadMore = async () => {
    if (loading) return;
    if (visibleCount >= sortedProducts.length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setVisibleCount((v) => Math.min(sortedProducts.length, v + itemsPerPage));
    setLoading(false);
  };
  useEffect(() => {
    if (mode !== "infinite") return;
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY + 120 >=
        document.documentElement.offsetHeight;
      if (nearBottom && !loading) loadMore();
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, visibleCount, loading, sortedProducts.length]);
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [activeCategory.main, sortOption, mode]);
  useEffect(() => {
    if (categoryName) {
      const findCategory = categories.find((cat) => cat.name === categoryName);
      if (subcategory) {
        setActiveCategory({ main: categoryName, sub: subcategory });
      } else {
        setActiveCategory({ main: categoryName, sub: findCategory?.sub[0] });
      }
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
  useEffect(() => {
    if (queryProduct) {
      setHighlightedProduct(queryProduct);
    }
  }, [queryProduct]);

  return (
    <section>
      <section className="relative w-full py-20 flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden ">
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="sm:text-4xl text-2xl md:text-6xl font-extrabold text-white drop-shadow-md"
          >
            Explore Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:text-lg md:text-xl  text-white drop-shadow-md "
          >
            Browse organized categories and find what you need, with quality
            selections to elevate your experience.
          </motion.p>
        </div>
      </section>
      <div className="w-full bg-gray-50 text-gray-800 min-h-screen md:py-10 py-6">
        <div className="container mx-auto xl:px-6 lg:px-6  px-4 ">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <Sidebar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              openDropdown={openDropdown}
              subcategory={subcategory}
              setOpenDropdown={setOpenDropdown}
            />
            {/* Products + controls */}
            <section className="flex-1">
              {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
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
                        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base  text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer category-select"
                        style={{ fontFamily: "Poppins", fontWeight: 700 }}
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
                </div>
                <div className="flex items-center gap-3 text-sm">
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
              </div> */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                {/* Showing Count */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing</span>
                  <span className="font-semibold text-gray-900">
                    {mode === "pagination"
                      ? `${startIndex + 1} - ${Math.min(
                          startIndex + itemsPerPage,
                          sortedProducts.length
                        )}`
                      : `1 - ${Math.min(visibleCount, sortedProducts.length)}`}
                  </span>
                  <span>of {sortedProducts.length}</span>
                </div>

                {/* Sorting & View Mode */}
                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-800 font-semibold shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition cursor-pointer"
                      style={{ fontFamily: "Poppins", fontWeight: 700 }}
                    >
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>

                  {/* View Mode Buttons */}
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-[#FF0055] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 rounded-lg ${
                        viewMode === "list"
                          ? "bg-[#FF0055] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>

                {/* Display Mode */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Mode:</span>
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
                        setMode(
                          mode === "pagination" ? "infinite" : "pagination"
                        )
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
    </section>
  );
}
