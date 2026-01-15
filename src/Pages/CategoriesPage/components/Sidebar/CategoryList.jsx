import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function CategoryList({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
  subcategory,
  item,
}) {
  const [openSubDropdown, setOpenSubDropdown] = useState(null);

  // Set initial openDropdown and active subcategory

  useEffect(() => {
    const cat = categories.find((c) => c.name === activeCategory.main);
    if (!cat) return;

    setOpenDropdown(categories.indexOf(cat));

    if (cat.sub && cat.sub.length > 0) {
      const matchedSub =
        cat.sub.find((s) => s.name === subcategory) || cat.sub[0];
      const matchedItem =
        matchedSub.items?.find((i) => i === item) ||
        matchedSub.items?.[0] ||
        null;

      setActiveCategory({
        main: cat.name,
        sub: matchedSub.name,
        item: matchedItem,
      });

      const subIdx = cat.sub.findIndex((s) => s.name === matchedSub.name);
      if (subIdx !== -1) setOpenSubDropdown(subIdx);
    } else {
      setActiveCategory({ main: cat.name, sub: null, item: null });
      setOpenSubDropdown(null);
    }
  }, [subcategory, item]); // main dependency বাদ দেওয়া হলো

  return (
    <ul className="space-y-3">
      {/* All Products */}
      <li>
        <button
          onClick={() =>
            setActiveCategory({ main: "All Products", sub: null, item: null })
          }
          className={`w-full text-left font-medium px-3 py-2 rounded-md hover:bg-gray-100 text-[15px] ${
            activeCategory.main === "All Products"
              ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
              : "text-gray-700"
          }`}
        >
          All Products
        </button>
      </li>

      {/* Main Categories */}

      {categories.map((cat, idx) => {
        const isActiveMain = activeCategory.main === cat.name;

        return (
          <li key={cat.name}>
            {/* Main Category */}
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-100 text-gray-600`}
              onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
            >
              <span className="font-medium">{cat.name}</span>
              {cat.sub?.length > 0 && (
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                    openDropdown === idx ? "-rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </div>

            {/* Subcategories */}
            {openDropdown === idx && cat.sub?.length > 0 && (
              <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
                {cat.sub.map((sub, subIdx) => {
                  const isActiveSub =
                    isActiveMain && activeCategory.sub === sub.name;

                  return (
                    <li key={sub.name}>
                      <div
                        className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-gray-100 text-gray-600`}
                        onClick={() =>
                          setOpenSubDropdown(
                            openSubDropdown === subIdx ? null : subIdx
                          )
                        }
                      >
                        <span className="text-sm font-medium">{sub.name}</span>
                        {sub.items?.length > 0 && (
                          <ChevronDown
                            className={`w-3 h-3 text-gray-400 transform transition-transform duration-200 ${
                              openSubDropdown === subIdx
                                ? "-rotate-180"
                                : "rotate-0"
                            }`}
                          />
                        )}
                      </div>

                      {/* Items */}
                      {openSubDropdown === subIdx && sub.items?.length > 0 && (
                        <ul className="mt-2 ml-4 space-y-1 border-l border-gray-200 pl-2">
                          {sub.items.map((item) => {
                            const isActiveItem =
                              isActiveSub && activeCategory.item === item;

                            return (
                              <li key={item}>
                                <div
                                  onClick={() =>
                                    setActiveCategory({
                                      main: cat.name,
                                      sub: sub.name,
                                      item: item,
                                    })
                                  }
                                  className={`w-full text-left px-3 py-1 rounded-md text-sm transition-colors duration-200 cursor-pointer ${
                                    isActiveItem
                                      ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                                      : "hover:bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  <span className="text-sm font-medium">
                                    {item}
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
