import React from "react";

function PromotionsView({ promotions, onAdd, setPromotions }) {
  const toggleActive = (id) =>
    setPromotions((p) =>
      p.map((x) => (x.id === id ? { ...x, active: !x.active } : x))
    );
  const removePromo = (id) =>
    setPromotions((p) => p.filter((x) => x.id !== id));

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Promotions ({promotions.length})</h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 rounded bg-[#FF0055] text-white"
        >
          New Promotion
        </button>
      </div>
      <div className="bg-white rounded shadow-sm p-3">
        {promotions.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div>
              <div className="font-medium">
                {p.code}{" "}
                <span className="text-xs text-gray-500">{p.discount}</span>
              </div>
              <div className="text-xs text-gray-500">
                {p.start || "-"} → {p.end || "-"}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleActive(p.id)}
                className={`px-2 py-1 rounded ${
                  p.active ? "bg-green-500 text-white" : "border"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => removePromo(p.id)}
                className="px-2 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromotionsView;
