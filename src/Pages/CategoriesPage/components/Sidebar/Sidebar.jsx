import React from "react";
import CategoryList from "./CategoryList";

export default function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
}) {
  return (
    <aside className="w-full lg:w-72">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
        </div>
      </div>
      {/* Mobile Sidebar trigger & drawer এখানে যুক্ত হবে */}
      {/* ...existing code... */}
    </aside>
  );
}
