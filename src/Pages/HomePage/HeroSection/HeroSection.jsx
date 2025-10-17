import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HashLink } from "react-router-hash-link";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] xl:px-6 lg:px-6  px-4 py-8 overflow-hidden">
      <div className="relative z-10 text-center w-full max-w-4xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-5xl font-extrabold text-white drop-shadow-md"
        >
          BECAUSE YOUR STYLE DESERVES A LITTLE ATTENTION
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 text-lg sm:text-xl text-white drop-shadow-md leading-relaxed"
        >
          Every product we offer is chosen to make your day better — from
          outfits that make you feel confident to gadgets that actually make
          life simpler.
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
  );
}
