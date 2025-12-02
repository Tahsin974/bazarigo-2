import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ImageGalleryModal({ images = [], onClose }) {
  const [current, setCurrent] = useState(0);
  const baseUrl = import.meta.env.VITE_BASEURL;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;

      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current]);

  const prev = () => {
    setCurrent((p) => (p === 0 ? images.length - 1 : p - 1));
  };

  const next = () => {
    setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl bg-white rounded shadow overflow-auto max-h-[90vh] relative"
        >
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white">
            <h2 className="text-xl font-semibold">Customer Details</h2>
            <button
              onClick={onClose}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </header>

          {/* Main Image */}
          <div className="relative h-80 flex items-center justify-center p-4">
            <img
              src={`${baseUrl}${images[current]}`}
              className="h-full max-w-full rounded-lg object-contain transition-all duration-300"
            />

            {/* Prev */}
            <button
              onClick={prev}
              disabled={images.length === 1}
              className={`absolute left-3 p-3 rounded-full text-white 
    ${
      images.length === 1
        ? "bg-black/20 cursor-not-allowed"
        : "bg-black/60 hover:bg-black/80 cursor-pointer"
    }
  `}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              onClick={next}
              disabled={images.length === 1}
              className={`absolute right-3 p-3 rounded-full text-white 
    ${
      images.length === 1
        ? "bg-black/20 cursor-not-allowed"
        : "bg-black/60 hover:bg-black/80 cursor-pointer"
    }
  `}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-2 mt-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={`${baseUrl}${img}`}
                  onClick={() => setCurrent(i)}
                  className={`h-16 w-full object-cover rounded-lg cursor-pointer border-2 transition 
                ${
                  current === i
                    ? "border-blue-500 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                />
              ))}
            </div>
          </div>

          {/* Counter */}
          <p className="text-center text-sm text-gray-600 mt-3">
            {current + 1} / {images.length}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
