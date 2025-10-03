import { ChevronDown } from "lucide-react";

export default function SortDropdown() {
  return (
    <div className="relative inline-block text-left z-10">
      <div className="relative inline-flex items-center">
        <select
          id="sort-select"
          className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer"
        >
          <option value="default" disabled>
            Sort By
          </option>
          <option value="Newest">Newest</option>
          <option value="Best Seller">Best Seller</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
      </div>
    </div>
  );
}
