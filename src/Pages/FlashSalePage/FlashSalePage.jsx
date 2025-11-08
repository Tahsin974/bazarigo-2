import { useState } from "react";
import SearchFilterSort from "./components/SearchFilterSort";

import Pagination from "../../components/ui/Pagination";

import FlashSaleCountdown from "../Shared/FlashSaleCountdown/FlashSaleCountdown";
import ProductCard from "../../components/ProductCard/ProductCard";
import { sampleFlashSale } from "../../Utils/Helpers/Helpers";
import { useRenderPageNumbers } from "../../Utils/Hooks/useRenderPageNumbers";

export default function FlashSalePage() {
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // const [displayedProducts, setDisplayedProducts] = useState([]);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Groceries",
    "Health & Beauty",
    "Home & Living",
    "Sports",
  ];

  let products = sampleFlashSale.saleProducts.filter(
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

  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage
  );

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
        <div className="container mx-auto xl:px-6 lg:px-6  px-4">
          {paginated.length === 0 ? (
            <>
              <div className=" text-center text-gray-500 py-8">
                No products found
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {paginated.map((product, index) => (
                  <ProductCard key={index} item={product} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                renderPageNumbers={renderPageNumbers}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
