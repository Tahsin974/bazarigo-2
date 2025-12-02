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

export default function HomePage() {
  const { user, isLoading } = useAuth();
  console.log("user", user);

  const axiosPublic = useAxiosPublic();
  const { data: flashSale, isLoading: isFlashSaleLoading } = useQuery({
    queryKey: ["flash-sale"],
    queryFn: async () => {
      const res = await axiosPublic.get("/flash-sale/active");
      return res.data;
    },
  });

  return (
    <div className="w-full bg-white font-sans text-gray-800">
      {isLoading || isFlashSaleLoading ? (
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

          <JustArrivedSection />
          <TrendingNowSection />
          {/* <CallToActionSection /> */}
        </>
      )}
    </div>
  );
}
