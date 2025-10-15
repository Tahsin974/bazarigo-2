import SortDropdown from "./components/SortDropdown";
import NewArrivalsGrid from "./components/NewArrivalsGrid";
import { motion } from "framer-motion";
import { sampleProducts } from "../../Utils/Helpers/Helpers";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

const allProducts = sampleProducts();

export default function JustArrivedPage() {
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // Filter logic
  const filtered = allProducts.filter(
    (prod) => prod.isNew && prod.isBestSeller
  );
  console.log(filtered);

  const sortedProducts = [...filtered].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Best Seller") return b.isBestSeller - a.isBestSeller;
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <section className="py-8">
        <div className="container mx-auto flex flex-col md:flex-row gap-4 justify-between items-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Just Arrived
          </h1>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </section>
      <NewArrivalsGrid
        filtered={displayedProducts}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
