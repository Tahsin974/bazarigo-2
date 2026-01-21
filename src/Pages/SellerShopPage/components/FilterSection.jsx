import { Filter } from "lucide-react";
import SelectField from "../../../components/ui/SelectField";

export default function FilterSection({ filter, setFilter }) {
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
            <option value="all">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Furniture & Home Decor">
              Furniture & Home Decor
            </option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Toys & Baby Products">Toys & Baby Products</option>
            <option value="Automotive & Industrial">
              Automotive & Industrial
            </option>
            <option value="Grocery & Food Items">Grocery & Food Items</option>
            <option value="Pets & Pet Care">Pets & Pet Care</option>
          </SelectField>
        </div>
      </section>
    </div>
  );
}
