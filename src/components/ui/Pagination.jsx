import { motion } from "framer-motion";

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  renderPageNumbers,
}) {
  return (
    <div className="flex justify-center items-center gap-3 mt-5">
      <motion.div
        whileHover={{ scale: currentPage > 1 ? 1.1 : 1 }}
        className={`p-2 border shadow-sm rounded-md ${
          currentPage === 1
            ? "opacity-30"
            : "cursor-pointer border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055] hover:text-white transition"
        }`}
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      >
        Prev
      </motion.div>
      {renderPageNumbers}
      <motion.div
        whileHover={{ scale: currentPage < totalPages ? 1.1 : 1 }}
        className={`p-2 border shadow-sm rounded-md ${
          currentPage === totalPages
            ? "opacity-30"
            : "cursor-pointer border-[#FF0055] text-[#FF0055] hover:bg-[#FF0055] hover:text-white transition"
        }`}
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      >
        Next
      </motion.div>
    </div>
  );
}
