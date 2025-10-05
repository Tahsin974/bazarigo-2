import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ReturnForm({ prefillOrderId, onSubmit }) {
  const [orderId, setOrderId] = useState(prefillOrderId || "");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (prefillOrderId) setOrderId(prefillOrderId);
  }, [prefillOrderId]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls]);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(orderId.trim(), reason.trim(), images);
        setOrderId("");
        setReason("");
        setImages([]);
      }}
      className="space-y-3"
    >
      <input
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Order ID"
        className="w-full border px-3 py-2 rounded-md"
      />
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for return"
        className="w-full border px-3 py-2 rounded-md"
      />

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Upload size={18} />
          <span className="text-sm">Upload Images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`preview-${idx}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-[#FF0055] text-white rounded-md"
        >
          Submit Request
        </button>
        <button
          type="button"
          onClick={() => {
            setOrderId("");
            setReason("");
            setImages([]);
          }}
          className="px-4 py-2 rounded-md border"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
