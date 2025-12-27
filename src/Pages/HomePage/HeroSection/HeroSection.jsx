import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HashLink } from "react-router-hash-link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useBanners from "../../../Utils/Hooks/useBanners";
import Loading from "../../../components/Loading/Loading";

export default function HeroSection() {
  const { banners, isPending } = useBanners();
  const baseUrl = import.meta.env.VITE_BASEURL;

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
                showArrows={false}
                showStatus={false}
                autoPlay={true}
                infiniteLoop={true}
                interval={5000}
                swipeable={true}
                showThumbs={false}
              >
                {banners.map((banner) => (
                  <a key={banner.id} target="_blank" href={banner.link}>
                    <div className="w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9]">
                      <img
                        src={`${baseUrl}${banner.image}`}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                ))}
              </Carousel>
            </section>
          )}
        </>
      )}
    </>
  );
}
