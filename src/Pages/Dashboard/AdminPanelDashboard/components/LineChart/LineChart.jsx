import React from "react";

const LineChart = ({ data = [] }) => {
  if (!data.length)
    return (
      <div className="h-[120px] flex items-center justify-center text-gray-400">
        No data
      </div>
    );
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  const points = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1 || 1)) * 100},${
          100 - ((Number(d.value) || 0) / max) * 100
        }`
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-[120px]">
      <polyline
        fill="none"
        strokeWidth="2"
        points={points}
        stroke="currentColor"
        className="text-[#FF0055]"
      />
    </svg>
  );
};

export default LineChart;
