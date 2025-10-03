import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] overflow-hidden">
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md"
        >
          Trending Now
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-white drop-shadow-md"
        >
          Discover what’s hot and selling fast. Get them before they’re gone!
        </motion.p>
      </div>
    </section>
  );
}
