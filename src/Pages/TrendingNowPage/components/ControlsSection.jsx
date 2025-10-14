import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

export default function ControlsSection({
  filterTag,
  setFilterTag,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) {
  const tags = [
    "All",
    "Hot",
    "Trending",
    "Best Seller",
    "Limited Stock",
    "Exclusive",
  ];
  return (
    <section className="py-10 border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              onClick={() => {
                setFilterTag(tag);
                setCurrentPage(1);
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border shadow-sm ${
                filterTag === tag
                  ? "bg-[#FF0055] text-white border-none"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:border-[#FF0055] focus:ring-2  focus:ring-[#FF0055] focus:outline-none shadow-sm"
            />
          </div>

          <div className="relative inline-block text-left z-10">
            <div className="relative inline-flex items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer"
              >
                <option value="default" disabled>
                  Sort By
                </option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="ratingHighLow">Rating: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
