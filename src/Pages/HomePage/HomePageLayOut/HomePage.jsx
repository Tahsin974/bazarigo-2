import FlashSaleCountdown from "../../Shared/FlashSaleCountdown/FlashSaleCountdown";
// import CallToActionSection from "../CallToActionSection/CallToActionSection";
import CategoriesSection from "../CategoriesSection/CategoriesSection";
import HeroSection from "../HeroSection/HeroSection";
import JustArrivedSection from "../JustArrivedSection/JustArrivedSection";

import TrendingNowSection from "../TrendingNowSection/TrendingNowSection";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import useAuth from "../../../Utils/Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useJustArrivedProducts from "../../../Utils/Hooks/useJustArrivedProducts";
import useTrendingProducts from "../../../Utils/Hooks/useTrendingProducts";

export default function HomePage() {
  const { isLoading } = useAuth();

  const axiosPublic = useAxiosPublic();
  const { data: flashSale } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: async () => {
      const res = await axiosPublic.get("/flash-sale/active");
      return res.data;
    },
  });
  const { data: justArrived = [] } = useJustArrivedProducts();
  const { data: trendingProducts = [] } = useTrendingProducts();
  return (
    <div className="w-full bg-white font-sans text-gray-800 space-y-10">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <HeroSection />
          <CategoriesSection />
          {!flashSale?.isactive ? (
            <></>
          ) : (
            <FlashSaleCountdown isButtonVisible={true} />
          )}
          {justArrived.length > 0 && <JustArrivedSection />}
          {trendingProducts.length > 0 && <TrendingNowSection />}
        </>
      )}
    </div>
  );
}
