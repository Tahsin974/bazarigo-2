import { Search } from "lucide-react";

export default function SearchField({
  searchValue,
  searchValueChange,
  placeholder,
}) {
  return (
    <div className="relative w-full xl:w-80 ">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
      <input
        type="text"
        value={searchValue}
        onChange={searchValueChange}
        placeholder={placeholder || "Search..."}
        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:border-[#FF0055] focus:ring-2  focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white"
      />
    </div>
  );
}
