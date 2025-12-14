import CategoryList from "./CategoryList";

export default function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
  subcategory,
}) {
  return (
    <aside className="w-full lg:w-72">
      {/* Desktop Sidebar */}
      <div className=" sticky top-24">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            subcategory={subcategory}
          />
        </div>
      </div>
    </aside>
  );
}
