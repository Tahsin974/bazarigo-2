import { useState } from "react";
import SearchFilterSort from "./components/SearchFilterSort";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

import Pagination from "../../components/ui/Pagination";

import FlashSaleCountdown from "../Shared/FlashSaleCountdown/FlashSaleCountdown";
import ProductCard from "../../components/ProductCard/ProductCard";
import { sampleProducts } from "../../Utils/Helpers/Helpers";

export default function FlashSalePage() {
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("Electronics");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const allProducts = sampleProducts();
  const categories = [
    "Electronics",
    "Fashion",
    "Groceries",
    "Health & Beauty",
    "Home & Living",
    "Sports",
  ];

  let products = allProducts.filter(
    (p) => category === "all" || p.category === category
  );
  if (search)
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  if (sort === "priceLow")
    products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "priceHigh")
    products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "rating")
    products = [...products].sort((a, b) => b.rating - a.rating);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < maxVisible - 1) {
      if (currentPage < totalPages / 2) {
        end = Math.min(totalPages, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    if (start > 1)
      pageNumbers.push(
        <MoreHorizontal
          key="start-ellipsis"
          className="w-5 h-5 text-gray-400"
        />
      );

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            currentPage === i
              ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055]"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </motion.div>
      );
    }

    if (end < totalPages)
      pageNumbers.push(
        <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
      );

    return pageNumbers;
  };

  return (
    <div className="w-full bg-white font-sans text-gray-800">
      <FlashSaleCountdown />
      <SearchFilterSort
        categories={categories}
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product, index) => (
              <ProductCard key={index} item={product} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            renderPageNumbers={renderPageNumbers}
          />
        </div>
      </section>
    </div>
  );
}
