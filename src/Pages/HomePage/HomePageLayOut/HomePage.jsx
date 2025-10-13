import FlashSaleCountdown from "../../Shared/FlashSaleCountdown/FlashSaleCountdown";
// import CallToActionSection from "../CallToActionSection/CallToActionSection";
import CategoriesSection from "../CategoriesSection/CategoriesSection";
import HeroSection from "../HeroSection/HeroSection";
import JustArrivedSection from "../JustArrivedSection/JustArrivedSection";

import TrendingNowSection from "../TrendingNowSection/TrendingNowSection";

export default function HomePage() {
  return (
    <div className="w-full bg-white font-sans text-gray-800">
      <HeroSection />
      <CategoriesSection />
      <FlashSaleCountdown isButtonVisible={true} />
      <JustArrivedSection />
      <TrendingNowSection />
      {/* <CallToActionSection /> */}
    </div>
  );
}
