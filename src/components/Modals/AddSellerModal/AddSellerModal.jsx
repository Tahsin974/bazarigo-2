import { motion } from "framer-motion";
import { X } from "lucide-react";

import SellerRegistrationForm from "../../SellerRegistrationForm/SellerRegistrationForm";

export default function AddSellerModal({ onClose, refetch }) {
  const PRIMARY_COLOR = "#FF0055";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-3xl shadow-2xl w-[95%] max-w-6xl h-[90vh] overflow-y-auto"
      >
        {/* --- Close Button --- */}

        {/* --- Header --- */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Add Seller </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>
        <div className="p-6">
          <SellerRegistrationForm
            PRIMARY_COLOR={PRIMARY_COLOR}
            refetch={refetch}
            creator="admin"
          />
        </div>
      </motion.div>
    </div>
  );
}
