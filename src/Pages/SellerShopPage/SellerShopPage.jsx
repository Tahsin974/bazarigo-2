import { useState } from "react";
import useProducts from "../../Utils/Hooks/useProducts";
import SellerHeader from "./components/SellerHeader";
import FilterSection from "./components/FilterSection";
import ProductGrid from "./components/ProductGrid";
import ReviewsSection from "./components/ReviewsSection";
import { useParams } from "react-router";
export default function SellerShopPage() {
  const { seller } = useParams();
  const [filter, setFilter] = useState("all");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { products } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category.includes(filter));

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {/* Seller Header */}
        <SellerHeader setIsMessageOpen={setIsMessageOpen} seller={seller} />
        {/* Filter Section */}
        <FilterSection filter={filter} setFilter={setFilter} />
        {/* Product Grid */}
        <ProductGrid
          filteredProducts={filteredProducts}
          displayedProducts={displayedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        {/* Reviews Section */}
        <ReviewsSection />

        {/* Message Modal */}
        {isMessageOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md relative">
              <button
                onClick={() => setIsMessageOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-4 text-center text-[#FF0055]">
                Message Seller
              </h3>
              <textarea
                className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                placeholder="Write your message..."
              ></textarea>
              <Button className="mt-4 w-full bg-[#FF0055] text-white rounded-full py-3 hover:bg-[#e6004c]">
                Send Message
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
