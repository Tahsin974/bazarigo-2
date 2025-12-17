import { useState } from "react";
import SearchFilterSort from "./components/SearchFilterSort";

import Pagination from "../../components/ui/Pagination";

import ProductCard from "../../components/ProductCard/ProductCard";

import useFlashSaleProducts from "../../Utils/Hooks/useFlashSaleProducts";
import { useRenderPageNumbers } from "../../Utils/Helpers/useRenderPageNumbers";
import FlashSaleCountdown from "../Shared/FlashSaleCountdown/FlashSaleCountdown";

export default function FlashSalePage() {
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // const [displayedProducts, setDisplayedProducts] = useState([]);

  const { flashSaleProducts: flashProducts } = useFlashSaleProducts();
  console.log(flashProducts);

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Groceries",
    "Health & Beauty",
    "Home & Living",
    "Sports",
    "Pet Supplies",
  ];

  let products = (flashProducts?.sale_products || []).filter(
    (p) => category === "All" || p.category === category
  );

  if (search)
    products = products.filter((p) =>
      p.product_name.toLowerCase().includes(search.toLowerCase())
    );
  if (sort === "priceLow")
    products = [...products].sort((a, b) => a.sale_price - b.sale_price);
  if (sort === "priceHigh")
    products = [...products].sort((a, b) => b.sale_price - a.sale_price);
  if (sort === "rating")
    products = [...products].sort((a, b) => b.rating - a.rating);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
  const paginated = shuffledProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderPageNumbers = useRenderPageNumbers(
    currentPage,
    totalPages,
    setCurrentPage
  );
  console.log("paginated", paginated);

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
      <section className="md:py-10 py-6 bg-gray-50">
        <div className="container mx-auto xl:px-6 lg:px-6  px-4">
          {paginated.length === 0 ? (
            <>
              <div className=" text-center md:py-10 py-6 text-gray-500 ">
                <h2>No products found</h2>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                {paginated.map((product, index) => (
                  <ProductCard
                    key={index}
                    item={product}
                    fromFlashSale={true}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  renderPageNumbers={renderPageNumbers}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
