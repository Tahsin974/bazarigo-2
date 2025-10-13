import { ChevronDown, Filter, Search } from "lucide-react";
import SelectField from "../../../components/ui/SelectField";

export default function SearchFilterSort({
  categories,
  category,
  setCategory,
  search,
  setSearch,
  sort,
  setSort,
}) {
  return (
    <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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
        {/* <div className="relative inline-block text-left z-10">
          <div className="relative inline-flex items-center">
            <select
              id="sort-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
          </div>
        </div> */}
      </div>
      <div className="relative w-full sm:w-80 order-2 sm:order-none">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:border-[#FF0055] focus:ring-2  focus:ring-[#FF0055] focus:outline-none shadow-sm"
        />
      </div>
      <div className="order-3 sm:order-none">
        <div className="relative inline-block text-left z-10">
          <div className="relative inline-flex items-center">
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer"
            >
              <option value="default" disabled>
                Sort By
              </option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
