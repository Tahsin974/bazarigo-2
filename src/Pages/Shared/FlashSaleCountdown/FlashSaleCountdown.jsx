import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import UseFlashSaleCountdown from "../../../Utils/Hooks/UseFlashSaleCountdown";
import { HashLink } from "react-router-hash-link";

export default function FlashSaleCountdown({ isButtonVisible = false }) {
  const { h, m, s, progress, getProgressColor } = UseFlashSaleCountdown(3600);
  return (
    <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white text-center xl:px-6 lg:px-6  px-4 py-16 overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-md"
      >
        ⚡ Flash Sale is Live!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-4 text-lg sm:text-xl drop-shadow-md"
      >
        Hurry up! Grab your favorites before time runs out.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 flex gap-4 text-center"
      >
        {[
          { label: "Hours", value: h },
          { label: "Minutes", value: m },
          { label: "Seconds", value: s },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/90 text-[#FF0055] px-6 py-4 rounded-lg shadow-lg border border-white/40 min-w-[80px]"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={item.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-extrabold tracking-wide inline-block"
              >
                {item.value}
              </motion.p>
            </AnimatePresence>
            <h4 className="text-xs font-semibold uppercase mt-1 text-gray-700">
              {item.label}
            </h4>
          </div>
        ))}
      </motion.div>
      <div className="mt-6 w-full max-w-xl h-3 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-3 ${getProgressColor()} rounded-full`}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {isButtonVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <HashLink to="/flash-sale#">
            <Button className="bg-white text-[#FF0055] font-semibold px-6 py-5 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105 cursor-pointer">
              Flash Sale Deals
            </Button>
          </HashLink>
        </motion.div>
      )}
    </section>
  );
}
