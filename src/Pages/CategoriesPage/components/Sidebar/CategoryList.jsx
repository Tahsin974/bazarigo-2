import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const userActionRef = useRef(false);

  useEffect(() => {
    if (userActionRef.current) return;
    if (!categories?.length) return;

    const catIndex = categories.findIndex(
      (c) => c.name === activeCategory.main,
    );
    if (catIndex === -1) return;

    const cat = categories[catIndex];

    // open main dropdown
    setOpenDropdown(catIndex);

    if (!cat.sub?.length) {
      if (activeCategory.sub !== null || activeCategory.item !== null) {
        setActiveCategory({
          main: cat.name,
          sub: null,
          item: null,
        });
      }
      setOpenSubDropdown(null);
      return;
    }

    const matchedSub =
      cat.sub.find((s) => s.name === subcategory) || cat.sub[0];

    const matchedItem =
      matchedSub.items?.find((i) => i === item) ||
      matchedSub.items?.[0] ||
      null;

    // 🔒 prevent infinite reset
    if (
      activeCategory.sub === matchedSub.name &&
      activeCategory.item === matchedItem
    )
      return;

    setActiveCategory({
      main: cat.name,
      sub: matchedSub.name,
      item: matchedItem,
    });

    const subIdx = cat.sub.findIndex((s) => s.name === matchedSub.name);
    setOpenSubDropdown(subIdx !== -1 ? subIdx : null);
  }, [subcategory, item, categories]);

  return (
    <ul className="space-y-3">
      {/* All Products */}
      <li>
        <button
          onClick={() => {
            userActionRef.current = true;
            setActiveCategory({ main: "All Products", sub: null, item: null });
            setOpenDropdown(null);
            setOpenSubDropdown(null);
          }}
          className={`w-full text-left font-medium px-3 py-2 rounded-md ${
            activeCategory.main === "All Products"
              ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          All Products
        </button>
      </li>

      {categories.map((cat, idx) => {
        const isActiveMain = activeCategory.main === cat.name;

        return (
          <li key={cat.name}>
            {/* Main Category */}
            <div
              className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100"
              onClick={() => {
                userActionRef.current = true;
                setOpenDropdown(openDropdown === idx ? null : idx);
                setOpenSubDropdown(null);
                setActiveCategory({
                  main: cat.name,
                  sub: null,
                  item: null,
                });
              }}
            >
              <span className="font-medium">{cat.name}</span>
              {cat.sub?.length > 0 && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === idx ? "-rotate-180" : ""
                  }`}
                />
              )}
            </div>

            {/* Subcategories */}
            {openDropdown === idx && cat.sub?.length > 0 && (
              <ul className="ml-4 mt-2 border-l pl-2 space-y-1">
                {cat.sub.map((sub, subIdx) => {
                  const isActiveSub =
                    isActiveMain && activeCategory.sub === sub.name;

                  return (
                    <li key={sub.name}>
                      <div
                        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          userActionRef.current = true;
                          setOpenSubDropdown(
                            openSubDropdown === subIdx ? null : subIdx,
                          );
                          setActiveCategory({
                            main: cat.name,
                            sub: sub.name,
                            item: null,
                          });
                        }}
                      >
                        <span className="text-sm font-medium">{sub.name}</span>
                        {sub.items?.length > 0 && (
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${
                              openSubDropdown === subIdx ? "-rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>

                      {/* Items */}
                      {openSubDropdown === subIdx && sub.items?.length > 0 && (
                        <ul className="ml-4 mt-2 border-l pl-2 space-y-1">
                          {sub.items.map((it) => {
                            const isActiveItem =
                              isActiveSub && activeCategory.item === it;

                            return (
                              <li key={it}>
                                <div
                                  onClick={() => {
                                    userActionRef.current = true;
                                    setActiveCategory({
                                      main: cat.name,
                                      sub: sub.name,
                                      item: it,
                                    });
                                  }}
                                  className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                                    isActiveItem
                                      ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                                      : "hover:bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {it}
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
