import React from "react";

function SellersView({ sellers, selected, toggleSelect, onAdd }) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Sellers ({sellers.length})</h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 rounded bg-[#FF0055] text-white"
        >
          Add Seller
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sellers.map((s) => (
          <div
            key={s.id}
            className="bg-white p-3 rounded shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-500">{s.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggleSelect(s.id)}
              />
              <button className="px-3 py-1 rounded border">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellersView;
