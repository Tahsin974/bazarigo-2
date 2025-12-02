import SortDropdown from "./components/SortDropdown";
import NewArrivalsGrid from "./components/NewArrivalsGrid";
import { useState } from "react";
import useAxiosPublic from "../../Utils/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";

export default function JustArrivedPage() {
  const axiosPublic = useAxiosPublic();

  const { data: allProducts = [], isPending } = useQuery({
    queryKey: ["just-arrived"],
    queryFn: async () => {
      const res = await axiosPublic.get("/just-arrived");
      return res.data.products;
    },
  });
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // Filter logic

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortOption === "Newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Best Seller") return b.isbestseller - a.isbestseller;
    if (sortOption === "Price: Low to High")
      return (
        (a.sale_price > 0 ? a.sale_price : a.regular_price) -
        (b.sale_price > 0 ? b.sale_price : b.regular_price)
      );
    if (sortOption === "Price: High to Low")
      return (
        (b.sale_price > 0 ? b.sale_price : b.regular_price) -
        (a.sale_price > 0 ? a.sale_price : a.regular_price)
      );
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
      {isPending ? (
        <Loading />
      ) : (
        <>
          <section className="py-8">
            <div className="container mx-auto flex flex-col md:flex-row gap-4 justify-between items-center px-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Just Arrived
              </h1>
              <SortDropdown
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>
          </section>
          <NewArrivalsGrid
            filtered={displayedProducts}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
