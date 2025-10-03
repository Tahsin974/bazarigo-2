import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search for products...",
  className = "",
}) {
  return (
    <div className={`w-full relative ${className}`}>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055] transition-all duration-300 focus:shadow-lg focus:scale-[1.02]"
      />
    </div>
  );
}
