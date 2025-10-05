import React from "react";

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="text-3xl text-[#FF0055]">●</div>
    </div>
  );
}

export default StatCard;
