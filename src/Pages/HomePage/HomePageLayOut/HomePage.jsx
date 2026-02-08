import FlashSaleCountdown from "../../Shared/FlashSaleCountdown/FlashSaleCountdown";
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
import useElectronicsCategoryProducts from "../../../Utils/Hooks/useElectronicsCategoryProducts";
import ElectronicsSection from "../ElectronicsSection/ElectronicsSection";
import useFashionCategoryProducts from "../../../Utils/Hooks/useFashionCategoryProducts";
import FashionSection from "../FashionSection/FashionSection";
import useHealthCategoryProducts from "../../../Utils/Hooks/useHealthCategoryProducts";
import HealthBeautySection from "../HealthBeautySection/HealthBeautySection";

import useGroceriesCategoryProducts from "../../../Utils/Hooks/useGroceriesCategoryProducts";
import GroceryFoodItemsSection from "../GroceryFoodItemsSection/GroceryFoodItemsSection";
import useToysCategoryProducts from "../../../Utils/Hooks/useToysCategoryProducts";
import ToysBabyProductsSection from "../ToysBabyProductsSection/ToysBabyProductsSection";
import useSportsCategoryProducts from "../../../Utils/Hooks/useSportsCategoryProducts";
import SportsOutdoorsSection from "../SportsOutdoorsSection/SportsOutdoorsSection";
import usePetsCategoryProducts from "../../../Utils/Hooks/usePetsCategoryProducts";
import PetsPetCareSection from "../PetsPetCareSection/PetsPetCareSection";
import useHomeLivingCategoryProducts from "../../../Utils/Hooks/useHomeLivingCategoryProducts";
import HomeLivingSection from "../HomeLivingSection/HomeLivingSection";

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
  const { data: electronicsProducts = [] } = useElectronicsCategoryProducts();
  const { data: fashionProducts = [] } = useFashionCategoryProducts();
  const { data: healthBeautyProducts = [] } = useHealthCategoryProducts();
  const { data: homeLivingProducts = [] } = useHomeLivingCategoryProducts();
  const { data: groceriesProducts = [] } = useGroceriesCategoryProducts();
  const { data: toysBabyProducts = [] } = useToysCategoryProducts();
  const { data: sportsOutdoorsProducts = [] } = useSportsCategoryProducts();
  const { data: petsPetCareProducts = [] } = usePetsCategoryProducts();

  return (
    <div className="w-full bg-white font-sans text-gray-800 space-y-10">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <HeroSection />

          {!flashSale?.isactive ? (
            <></>
          ) : (
            <FlashSaleCountdown isButtonVisible={true} />
          )}
          <CategoriesSection />
          {electronicsProducts.length > 0 && <ElectronicsSection />}
          {fashionProducts.length > 0 && <FashionSection />}
          {healthBeautyProducts.length > 0 && <HealthBeautySection />}
          {homeLivingProducts.length > 0 && <HomeLivingSection />}
          {groceriesProducts.length > 0 && <GroceryFoodItemsSection />}
          {toysBabyProducts.length > 0 && <ToysBabyProductsSection />}
          {sportsOutdoorsProducts.length > 0 && <SportsOutdoorsSection />}
          {petsPetCareProducts.length > 0 && <PetsPetCareSection />}
          {trendingProducts.length > 0 && <TrendingNowSection />}
          {justArrived.length > 0 && <JustArrivedSection />}
        </>
      )}
    </div>
  );
}
