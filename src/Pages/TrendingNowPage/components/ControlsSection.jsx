import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import SearchField from "../../../components/ui/SearchField";
import SelectField from "../../../components/ui/SelectField";

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
    "Best Seller",
    "Exclusive",
    "Hot",
    "Limited Stock",
    "Trending",
  ];
  return (
    <section className="py-6 border-b bg-white shadow-sm">
      <div className="xl:container mx-auto px-6 flex flex-col xl:flex-row justify-between items-center gap-6">
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
              className={`px-3 py-2 rounded-lg sm:text-base text-[14px] font-medium transition-all border shadow-sm ${
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
        <div className="flex flex-wrap gap-4 items-center">
          <SearchField
            placeholder="Search products..."
            searchValue={searchTerm}
            searchValueChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <SelectField
            selectValue={sortOption}
            selectValueChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default" disabled>
              Sort By
            </option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="ratingHighLow">Rating: High to Low</option>
          </SelectField>
        </div>
      </div>
    </section>
  );
}
