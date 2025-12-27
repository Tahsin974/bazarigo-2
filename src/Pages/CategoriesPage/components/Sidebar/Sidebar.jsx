import CategoryList from "./CategoryList";

export default function Sidebar({
  categories,
  activeCategory,
  setActiveCategory,
  openDropdown,
  setOpenDropdown,
  subcategory,
  item,
}) {
  return (
    <aside className="w-full md:w-auto">
      {/* Desktop Sidebar */}
      <div className=" sticky top-24">
        <div className="bg-white rounded-2xl shadow md:p-6 p-4">
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <CategoryList
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            subcategory={subcategory}
            item={item}
          />
        </div>
      </div>
    </aside>
  );
}
