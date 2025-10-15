import { useEffect, useState } from "react";
import SearchFilterSort from "./components/SearchFilterSort";

import Pagination from "../../components/ui/Pagination";

import FlashSaleCountdown from "../Shared/FlashSaleCountdown/FlashSaleCountdown";
import ProductCard from "../../components/ProductCard/ProductCard";
import { sampleProducts } from "../../Utils/Helpers/Helpers";
import { useRenderPageNumbers } from "../../Utils/Hooks/useRenderPageNumbers";

export default function FlashSalePage() {
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [displayedProducts, setDisplayedProducts] = useState([]);

  const allProducts = sampleProducts();
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Groceries",
    "Health & Beauty",
    "Home & Living",
    "Sports",
  ];

  let products = allProducts.filter(
    (p) => category === "All" || p.category === category
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
  const updateProducts = () => {
    const flashSaleProducts = products.filter(
      (p) => (p.rating > 4 || p.isNew) && p.stock > 30
    );
    const shuffledProducts = [...flashSaleProducts].sort(
      () => 0.5 - Math.random()
    );
    const paginated = shuffledProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setDisplayedProducts(paginated);
  };

  useEffect(() => {
    updateProducts();
  }, [currentPage]);

  return (
    <div className="w-full bg-white font-sans text-gray-800">
      <FlashSaleCountdown onComplete={updateProducts} />
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
            renderPageNumbers={useRenderPageNumbers(
              currentPage,
              totalPages,
              setCurrentPage
            )}
          />
        </div>
      </section>
    </div>
  );
}
