import { Filter } from "lucide-react";
import SelectField from "../../../components/ui/SelectField";

export default function FilterSection({ filter, setFilter, products }) {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Health & Beauty",
    "Home & Living",
    "Grocery & Food",
    "Sports & Outdoors",
    "Toys & Kids",
    "Pet Supplies",
  ];
  const filteredCategories = categories.filter(
    (cat) => cat === "All" || products.some((p) => p.category === cat),
  );
  return (
    <div>
      <section className="py-8 px-6 md:px-12 bg-white shadow-sm flex sm:flex-row flex-col sm:justify-between justify-center gap-3 items-center max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-3">
          <Filter className="text-[#FF0055] w-5 h-5" />
          <SelectField
            selectValue={filter}
            selectValueChange={(e) => setFilter(e.target.value)}
          >
            {filteredCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </SelectField>
        </div>
      </section>
    </div>
  );
}
