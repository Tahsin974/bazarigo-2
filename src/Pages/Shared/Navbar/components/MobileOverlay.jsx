import { motion } from "framer-motion";

export default function MobileOverlay({ isMenuOpen, onClose }) {
  if (!isMenuOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black z-40"
      onClick={onClose}
    ></motion.div>
  );
}
