import { useState } from "react";
import HeroSection from "./components/HeroSection";
import ControlsSection from "./components/ControlsSection";
import ProductsGrid from "./components/ProductsGrid";
import Pagination from "../../components/ui/Pagination";
import { motion } from "framer-motion";
import img from "../../assets/Products/BAJEAL T350 Luminous USB Keyboard & Mouse Set Computer Gaming Mechanical Feel Floating Rainbow Backli.jpg";
import { MoreHorizontal } from "lucide-react";

export default function TrendingNowPage() {
  const allProducts = [
    {
      name: "Portable Bluetooth Speaker",
      oldPrice: 110,
      price: 85,
      discount: 23, // 23% OFF
      rating: 5,
      img: img,

      isBestSeller: true,
      isHot: true,
    },
    {
      name: "Classic Low-Top Sneakers",
      oldPrice: 90,
      price: 75,
      discount: 17, // 17% OFF
      rating: 4,
      img: "https://placehold.co/400x400/00C4B8/ffffff?text=Sneakers",
      isBestSeller: true,
      isTrending: true,
    },
    {
      name: "Automatic Drip Coffee Maker",
      oldPrice: 72,
      price: 50,
      discount: 31, // 31% OFF
      rating: 5,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Coffee+Maker",
      isBestSeller: true,
    },
    {
      name: "Insulated Travel Mug",
      oldPrice: 35,
      price: 25,
      discount: 29, // 29% OFF
      rating: 4,
      img: "https://placehold.co/400x400/007BFF/ffffff?text=Travel+Mug",
      isHot: true,
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
      isLimitedStock: true,
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
      isTrending: true,
    },
    {
      name: "Luxury Wristwatch",
      oldPrice: 650,
      price: 420,
      discount: 35, // 35% OFF
      rating: 5,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
      isExclusive: true,
    },
  ];

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTag, setFilterTag] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = allProducts.filter((product) => {
    const matchesTag = filterTag === "All" || product.tag === filterTag;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceLowHigh") {
      return (
        parseFloat(a.price.replace("$", "")) -
        parseFloat(b.price.replace("$", ""))
      );
    }
    if (sortOption === "priceHighLow") {
      return (
        parseFloat(b.price.replace("$", "")) -
        parseFloat(a.price.replace("$", ""))
      );
    }
    if (sortOption === "ratingHighLow") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

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
    <div className="w-full bg-gray-50 font-sans text-gray-800">
      <HeroSection />
      <ControlsSection
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        setCurrentPage={setCurrentPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <section className="py-12">
        <div className="container mx-auto px-6">
          <ProductsGrid
            paginatedProducts={paginatedProducts}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
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
