import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export const useRenderPageNumbers = (
  currentPage,
  totalPages,
  setCurrentPage
) => {
  const pageNumbers = [];
  const maxVisible = 3; // maximum buttons to show
  let start = Math.max(1, currentPage - 1); // show one before current
  let end = Math.min(totalPages, currentPage + 1); // show one after current

  // Adjust if we are at the start or end
  if (end - start < maxVisible - 1) {
    if (currentPage === 1) {
      end = Math.min(totalPages, start + maxVisible - 1);
    } else if (currentPage === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
  }

  if (start > 1)
    pageNumbers.push(
      <MoreHorizontal key="start-ellipsis" className="w-5 h-5 text-gray-400" />
    );

  for (let i = start; i <= end; i++) {
    pageNumbers.push(
      <motion.div
        key={i}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentPage(i)}
        className={`flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md 
    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
    ${
      currentPage === i
        ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055]"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`}
      >
        {i}
      </motion.div>
    );
  }

  if (end < totalPages)
    pageNumbers.push(
      <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
    );

  return pageNumbers;
};
