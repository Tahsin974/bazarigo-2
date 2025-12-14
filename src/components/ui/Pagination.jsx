import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  renderPageNumbers,
}) {
  return (
    <div className="flex justify-center items-center gap-3 mt-10">
      <motion.div
        whileHover={{ scale: currentPage > 1 ? 1.1 : 1 }}
        className={` w-8 h-8 border shadow-sm rounded-md flex items-center justify-center ${
          currentPage === 1
            ? "opacity-30"
            : "cursor-pointer border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055] hover:text-white transition"
        }`}
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      >
        <ChevronLeft />
      </motion.div>
      {renderPageNumbers}
      <motion.div
        whileHover={{ scale: currentPage < totalPages ? 1.1 : 1 }}
        className={` w-8 h-8 border shadow-sm rounded-md flex items-center justify-center ${
          currentPage === totalPages
            ? "opacity-30"
            : "cursor-pointer border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055] hover:text-white transition"
        }`}
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      >
        <ChevronRight />
      </motion.div>
    </div>
  );
}
