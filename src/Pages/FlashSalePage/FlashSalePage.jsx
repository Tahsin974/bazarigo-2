import { useState } from "react";
import SearchFilterSort from "./components/SearchFilterSort";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import img from "../../assets/Products/BAJEAL T350 Luminous USB Keyboard & Mouse Set Computer Gaming Mechanical Feel Floating Rainbow Backli.jpg";
import Pagination from "../../components/ui/Pagination";

import FlashSaleCountdown from "../Shared/FlashSaleCountdown/FlashSaleCountdown";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function FlashSalePage() {
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const allProducts = [
    {
      name: "Portable Bluetooth Speaker",
      oldPrice: 110,
      price: 85,
      discount: 23, // 23% OFF
      rating: 5,
      img: img,
    },
    {
      name: "Classic Low-Top Sneakers",
      oldPrice: 90,
      price: 75,
      discount: 17, // 17% OFF
      rating: 4,
      img: "https://placehold.co/400x400/00C4B8/ffffff?text=Sneakers",
    },
    {
      name: "Automatic Drip Coffee Maker",
      oldPrice: 72,
      price: 50,
      discount: 31, // 31% OFF
      rating: 5,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Coffee+Maker",
    },
    {
      name: "Insulated Travel Mug",
      oldPrice: 35,
      price: 25,
      discount: 29, // 29% OFF
      rating: 4,
      img: "https://placehold.co/400x400/007BFF/ffffff?text=Travel+Mug",
    },
    {
      name: "Smart LED Desk Lamp",
      oldPrice: 60,
      price: 45,
      discount: 25, // 25% OFF
      rating: 5,
      img: "https://placehold.co/400x400/9B59B6/ffffff?text=Desk+Lamp",
    },
    {
      name: "Wireless Earbuds Pro",
      oldPrice: 165,
      price: 149,
      discount: 10, // 10% OFF
      rating: 5,
      img: "https://placehold.co/400x400/00C48C/ffffff?text=Earbuds",
    },
    {
      name: "Premium Office Chair",
      oldPrice: 260,
      price: 210,
      discount: 19, // 19% OFF
      rating: 4,
      img: "https://placehold.co/400x400/FF7B7B/ffffff?text=Office+Chair",
    },
    {
      name: "4K Ultra HD Monitor",
      oldPrice: 399,
      price: 299,
      discount: 25, // 25% OFF
      rating: 5,
      img: "https://placehold.co/400x400/007BFF/ffffff?text=Monitor",
    },
    {
      name: "Luxury Wristwatch",
      oldPrice: 650,
      price: 420,
      discount: 35, // 35% OFF
      rating: 5,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
    },
  ];

  let products = allProducts.filter(
    (p) => category === "all" || p.category === category
  );
  if (search)
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  if (sort === "priceLow")
    products = [...products].sort((a, b) => a.newPrice - b.newPrice);
  if (sort === "priceHigh")
    products = [...products].sort((a, b) => b.newPrice - a.newPrice);
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
