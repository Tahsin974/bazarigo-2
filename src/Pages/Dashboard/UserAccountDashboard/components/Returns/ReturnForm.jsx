import React, { useState } from "react";
import UploadImages from "../../../../../components/ui/UploadImages";
import { X } from "lucide-react";

export default function ReturnForm({ onSubmit }) {
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(orderId.trim(), reason.trim(), images);
    setOrderId("");
    setReason("");
    setImages([]);
  };
  // Function to remove image by index
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleReset = () => {
    setOrderId("");
    setReason("");
    setImages([]);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        className="w-full border px-3 py-2 rounded-md focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
      />
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for return"
        className="w-full border px-3 py-2 rounded-md focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none"
      />

      <div>
        <UploadImages handleImageUpload={handleImageUpload}>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {(images || []).map((src, i) => (
              <div
                key={i}
                className="w-full h-24 rounded overflow-hidden relative"
              >
                <img
                  src={src}
                  alt={`product-${i}`}
                  className="w-full h-full object-cover"
                />
                {/* ❌ X Button */}
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6  text-gray-500 rounded-full flex items-center justify-center text-sm  transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </UploadImages>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-[#00C853] hover:bg-[#00B34A] text-white rounded-md"
        >
          Submit Request
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 rounded-md  bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
