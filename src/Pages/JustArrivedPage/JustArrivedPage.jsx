import NewArrivalsGrid from "./components/NewArrivalsGrid";
import { useState } from "react";
import Loading from "../../components/Loading/Loading";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import SelectField from "../../components/ui/SelectField";
import useJustArrivedProducts from "../../Utils/Hooks/useJustArrivedProducts";

export default function JustArrivedPage() {
  const { data: allProducts = [], isPending } = useJustArrivedProducts();

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Groceries",
    "Health & Beauty",
    "Home & Living",
    "Sports",
    "Pet Supplies",
  ];

  const [sortOption, setSortOption] = useState("Newest");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter products
  let filteredProducts = [...allProducts].filter(
    (p) => category === "All" || p.category === category
  );

  if (search) {
    const q = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        (p.product_name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortOption) {
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);

      case "Price: Low to High":
        return (
          (a.sale_price || a.regular_price) - (b.sale_price || b.regular_price)
        );
      case "Price: High to Low":
        return (
          (b.sale_price || b.regular_price) - (a.sale_price || a.regular_price)
        );
      default:
        return 0;
    }
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {isPending ? (
        <Loading />
      ) : (
        <>
          <section className="relative w-full py-20 flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden">
            <div className="relative z-10 text-center px-6">
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="sm:text-4xl text-2xl md:text-6xl font-extrabold text-white drop-shadow-md"
              >
                Just Arrived
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 sm:text-lg md:text-xl text-white drop-shadow-md"
              >
                New drops are here, trendy and affordable. Grab yours before
                they run out!
              </motion.p>
            </div>
          </section>

          <section className="shadow-sm border-b">
            <div className="container mx-auto xl:px-6 lg:px-6 px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 order-1 sm:order-none">
                <Filter className="text-[#FF0055]" />
                <SelectField
                  selectValue={category}
                  selectValueChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="relative w-full sm:w-80 order-2 sm:order-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm"
                />
              </div>

              <div className="order-3 sm:order-none">
                <div className="relative inline-block text-left z-10">
                  <SelectField
                    selectValue={sortOption}
                    selectValueChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="default" disabled>
                      Sort By
                    </option>
                    <option value="Newest">Newest</option>

                    <option value="Price: Low to High">
                      Price: Low to High
                    </option>
                    <option value="Price: High to Low">
                      Price: High to Low
                    </option>
                  </SelectField>
                </div>
              </div>
            </div>
          </section>

          <NewArrivalsGrid
            filtered={displayedProducts}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
