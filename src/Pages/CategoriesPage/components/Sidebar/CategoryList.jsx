import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

export default function CategoryList({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
  subcategory,
}) {
  useEffect(() => {
    categories.forEach((cat, idx) => {
      if (cat.name === activeCategory.main) {
        setOpenDropdown(idx);
        if (cat.sub && cat.sub.length > 0) {
          const matchedSub = cat.sub.find((s) => s === subcategory);
          setActiveCategory({
            main: cat.name,
            sub: matchedSub || cat.sub[0],
          });
        } else {
          setActiveCategory({
            main: cat.name,
            sub: null,
          });
        }
      }
    });
  }, [subcategory, activeCategory.main]);
  console.log(activeCategory);

  return (
    <ul className="space-y-3">
      <li>
        <button
          onClick={() => setActiveCategory({ main: "All Products" })}
          className={`w-full text-left font-medium px-3 py-2 rounded-md hover:bg-gray-100 ${
            activeCategory.main === "All Products"
              ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white "
              : "text-gray-700  "
          }`}
        >
          All Products
        </button>
      </li>
      {categories.map((cat, idx) => (
        <li key={cat.name}>
          <div className="flex items-center justify-between hover:bg-gray-100 px-3 rounded-md">
            <button
              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
              className="text-gray-700 font-medium flex-1 text-left   w-full  py-2 rounded-md "
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
            <ul className="mt-2 ml-3 space-y-2  border-l border-gray-200 pl-2">
              {cat.sub.map((s) => (
                <li key={s}>
                  <button
                    onClick={() =>
                      setActiveCategory({ main: cat.name, sub: s })
                    }
                    className={`text-sm w-full px-3 py-2 rounded-md text-left hover:bg-gray-100 ${
                      activeCategory.main === cat.name &&
                      activeCategory.sub === s
                        ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                        : "text-gray-600"
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
