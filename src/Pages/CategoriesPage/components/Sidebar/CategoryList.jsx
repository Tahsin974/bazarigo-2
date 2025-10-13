import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

export default function CategoryList({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
}) {
  useEffect(() => {
    categories.forEach((cat, idx) => {
      // Match the category name with the route param (case-insensitive)
      if (cat.name === activeCategory) {
        setOpenDropdown(idx); // open the matching dropdown
        if (cat.sub && cat.sub.length > 0) {
          setActiveCategory(cat.sub[0]); // select the first subcategory
        } else {
          setActiveCategory(cat.name); // or the main category
        }
      }
    });
  }, [categories]);
  return (
    <ul className="space-y-3">
      <li>
        <button
          onClick={() => setActiveCategory("All Products")}
          className={`w-full text-left font-medium px-3 py-2 rounded-md hover:bg-gray-100 ${
            activeCategory === "All Products"
              ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white "
              : "text-gray-700  "
          }`}
        >
          All Products
        </button>
      </li>
      {categories.map((cat, idx) => (
        <li key={cat.name}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
              className="text-gray-700 font-medium flex-1 text-left   w-full px-3 py-2 rounded-md hover:bg-gray-100"
            >
              {cat.name}
            </button>
            <button
              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
              className="ml-3 text-gray-400"
            >
              <ChevronDown
                className={`w-4 h-4 transform ${
                  openDropdown === idx ? "-rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>
          {openDropdown === idx && (
            <ul className="mt-2 ml-3 space-y-2">
              {cat.sub.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => setActiveCategory(s)}
                    className={`text-sm w-full px-3 py-2 rounded-md text-left hover:bg-gray-100 ${
                      activeCategory === s
                        ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                        : "text-gray-600  "
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
