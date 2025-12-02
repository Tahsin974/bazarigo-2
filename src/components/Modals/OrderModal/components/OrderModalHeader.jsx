import { X } from "lucide-react";

export default function OrderModalHeader({ onClose }) {
  return (
    <div>
      <div className="flex items-center justify-between bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-lg font-semibold">Order Details</h2>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
