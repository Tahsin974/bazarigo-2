import { X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function AddPromotionModal({ onClose }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
          <h2 className="text-xl font-semibold">Add Promotion </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>

        <main className=" my-7 mx-5">
          <form className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm mb-2">Promo Code</label>
              <input
                type="number"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                placeholder="Promo Code"
                className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
              />
            </div>
            <div>
              <label className="text-sm mb-2">Discount</label>
              <input
                type="number"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // keyboard up/down disable
                  }
                }}
                onWheel={(e) => e.target.blur()}
                placeholder="Discount"
                className={`w-full px-4 py-3 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-[#FF0055]`}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-2">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                dateFormat="dd/MM/yyyy"
                placeholderText={"Select Start Date"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-2">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                dateFormat="dd/MM/yyyy"
                placeholderText={"Select End Date"}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white mt-1"
              />
            </div>
          </form>
        </main>
      </motion.div>
    </div>
  );
}

export default AddPromotionModal;
