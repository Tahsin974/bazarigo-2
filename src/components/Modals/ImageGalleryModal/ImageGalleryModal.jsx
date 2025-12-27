import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function ImageGalleryModal({ images = [], onClose }) {
  const [current, setCurrent] = useState(0);
  const video = images[current] ? images[current].endsWith(".mp4") : false;
  const baseUrl = import.meta.env.VITE_BASEURL;
  const videoRef = useRef();
  const [isPaused, setIsPaused] = useState(true);

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

  useEffect(() => {
    // Pause video when changing media
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPaused(true);
    }
  }, [current]);

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
              onClick={() => {
                if (videoRef.current && !videoRef.current.paused) {
                  videoRef.current.pause();
                  setIsPaused(true);
                }
                onClose();
              }}
              className="hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </header>

          {/* Main Image */}

          <div className="w-full max-w-xl mx-auto p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Prev Button */}
              <button
                onClick={prev}
                disabled={images.length === 1}
                className={`flex-shrink-0 p-3 rounded-full text-white transition ${
                  images.length === 1
                    ? "bg-black/20 cursor-not-allowed"
                    : "bg-black/60 hover:bg-black/80 cursor-pointer"
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Media Container */}
              <div className="relative flex-1 h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                {video ? (
                  <div className="relative flex-1 flex items-center justify-center">
                    <div className="relative group w-full h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden">
                      <video
                        ref={videoRef}
                        src={`${baseUrl}${images[current]}`}
                        className="w-full h-full object-fill rounded-2xl transition-transform duration-300 group-hover:scale-105"
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        onEnded={() => setIsPaused(true)}
                      />

                      <button
                        onClick={() => {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsPaused(false);
                          } else {
                            videoRef.current.pause();
                            setIsPaused(true);
                          }
                        }}
                        className="absolute inset-0 m-auto flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-gray-500/60 text-gray-200 p-3 rounded-full shadow-md transition duration-200 ease-in-out w-16 h-16"
                      >
                        {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${baseUrl}${images[current]}`}
                    className="w-full h-full max-w-full max-h-full object-fill transition-all duration-300"
                  />
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={next}
                disabled={images.length === 1}
                className={`flex-shrink-0 p-3 rounded-full text-white transition ${
                  images.length === 1
                    ? "bg-black/20 cursor-not-allowed"
                    : "bg-black/60 hover:bg-black/80 cursor-pointer"
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}

          <div className="flex justify-center mt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-2">
              {images.map((item, i) => {
                const isVideo =
                  item.endsWith(".mp4") ||
                  item.endsWith(".webm") ||
                  item.endsWith(".ogg");
                if (isVideo) {
                  return (
                    <div className="w-20 h-20 flex-shrink-0">
                      <video
                        key={i}
                        src={`${baseUrl}${item}`}
                        onClick={() => setCurrent(i)}
                        className={`w-full h-full object-fill rounded-lg cursor-pointer border-2 transition ${
                          current === i
                            ? "border-blue-500 shadow-md"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      />
                    </div>
                  );
                }
                return (
                  <img
                    key={i}
                    src={`${baseUrl}${item}`}
                    onClick={() => setCurrent(i)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg cursor-pointer border-2 transition ${
                      current === i
                        ? "border-blue-500 shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  />
                );
              })}
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
