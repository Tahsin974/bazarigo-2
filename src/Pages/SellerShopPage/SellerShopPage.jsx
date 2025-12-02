import { useEffect, useState } from "react";
import SellerHeader from "./components/SellerHeader";
import FilterSection from "./components/FilterSection";
import ProductGrid from "./components/ProductGrid";
import ReviewsSection from "./components/ReviewsSection";
import { useParams } from "react-router";
import { X } from "lucide-react";

import { useLocation } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../Utils/Hooks/useAuth";
import Loading from "../../components/Loading/Loading";
import useAxiosSecure from "../../Utils/Hooks/useAxiosSecure";
import SendMessage from "../../components/Modals/MessageModal/SendMessage";

export default function SellerShopPage() {
  const queryClient = useQueryClient();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { seller } = useParams();
  const [filter, setFilter] = useState("all");
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const location = useLocation();

  const { user, isLoading } = useAuth();
  const params = new URLSearchParams(location.search);
  const sellerId = atob(params.get("id"));
  const { data: sellerProducts = [] } = useQuery({
    queryKey: ["sellerProducts", sellerId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/seller/${sellerId}`);
      return res.data.products;
    },
  });

  const { data: sellerDetails = {}, isPending: sellerLoad } = useQuery({
    queryKey: ["sellerDetails"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers/${sellerId}`);
      return res.data.seller;
    },
  });
  console.log("seller", sellerDetails);
  const filteredProducts =
    filter === "all"
      ? sellerProducts
      : sellerProducts.filter((p) => p.category.includes(filter));

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / itemsPerPage)
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const mutation = useMutation({
    mutationFn: () =>
      axiosPublic.post("/send", {
        sender_id: user?.id,
        sender_role: user.role,
        receiver_id: sellerId,
        receiver_role: "seller",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversation", user?.id, sellerId]);
    },
  });

  useEffect(() => {
    if (isMessageOpen) {
      mutation.mutate(); // modal open হোলেই auto message পাঠাবে
    }
  }, [isMessageOpen]);
  return (
    <div>
      {isLoading && sellerLoad ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
          {/* Seller Header */}
          <SellerHeader
            setIsMessageOpen={setIsMessageOpen}
            seller={seller}
            sellerId={sellerId}
            userId={user?.id}
            sellerDetails={sellerDetails}
          />
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
              <div className="bg-white p-2 rounded-2xl shadow-xl w-full max-w-3xl overflow-auto max-h-[90vh] relative">
                <button
                  onClick={() => setIsMessageOpen(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
                <h3 className="text-2xl font-bold  text-center text-[#FF0055] mt-2">
                  Message Seller
                </h3>
                <main className="md:p-6 p-4">
                  <SendMessage
                    senderId={user?.id}
                    isMessageOpen={isMessageOpen}
                    senderRole={user.role}
                    receiverId={sellerId}
                    receiverRole={"seller"}
                    user={sellerDetails}
                  />
                </main>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
