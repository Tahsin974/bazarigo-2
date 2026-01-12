import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HashLink } from "react-router-hash-link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useBanners from "../../../Utils/Hooks/useBanners";
import Loading from "../../../components/Loading/Loading";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  const { banners, isPending } = useBanners();
  const baseUrl = import.meta.env.VITE_BASEURL;
  const showNavigation = banners.length > 1;

  return (
    <>
      {isPending ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {!banners.length ? (
            <>
              <section className="relative w-full  min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] xl:px-6 lg:px-6  px-4 py-8 overflow-hidden">
                <div className="relative z-10 text-center w-full max-w-4xl px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-5xl md:text-5xl font-extrabold text-white drop-shadow-md"
                  >
                    BECAUSE YOUR STYLE DESERVES A LITTLE ATTENTION
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-8 text-lg sm:text-xl text-white drop-shadow-md leading-relaxed"
                  >
                    Every product we offer is chosen to make your day better —
                    from outfits that make you feel confident to gadgets that
                    actually make life simpler.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8"
                  >
                    <HashLink to="/categories/All Products#">
                      <Button className="bg-white text-[#FF0055] font-semibold px-6 py-5 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105 cursor-pointer">
                        Shop the Collection
                      </Button>
                    </HashLink>
                  </motion.div>
                </div>
              </section>
            </>
          ) : (
            <section>
              <Carousel
                showStatus={false}
                autoPlay={showNavigation}
                infiniteLoop={showNavigation}
                interval={5000}
                swipeable={true}
                showThumbs={false}
                showIndicators={false}
                showArrows={showNavigation}
                renderArrowPrev={(onClickHandler, hasPrev, label) =>
                  showNavigation &&
                  hasPrev && (
                    <button
                      onClick={onClickHandler}
                      title={label}
                      className="
          absolute z-10
          left-2 sm:left-3
          top-1/2
          -translate-y-1/2
          w-8 h-8 sm:w-14 sm:h-14
          rounded-full
          bg-black/20 hover:bg-black/30
          text-white/80 hover:text-white
          flex items-center justify-center
          transition-all duration-300
          active:scale-95
        "
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-10 sm:h-10" />
                    </button>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext, label) =>
                  showNavigation &&
                  hasNext && (
                    <button
                      onClick={onClickHandler}
                      title={label}
                      className="
          absolute z-10
          right-2 sm:right-3
          top-1/2
          -translate-y-1/2
          w-8 h-8 sm:w-14 sm:h-14
          rounded-full
          bg-black/20 hover:bg-black/30
          text-white/80 hover:text-white
          flex items-center justify-center
          transition-all duration-300
          active:scale-95
        "
                    >
                      <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
                    </button>
                  )
                }
              >
                {banners.map((banner) =>
                  banner?.link === "" ? (
                    <div
                      key={banner.id}
                      className="w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9]"
                    >
                      <img
                        src={`${baseUrl}${banner.image}`}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <a
                      key={banner.id}
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9]">
                        <img
                          src={`${baseUrl}${banner.image}`}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </a>
                  )
                )}
              </Carousel>
            </section>
          )}
        </>
      )}
    </>
  );
}
