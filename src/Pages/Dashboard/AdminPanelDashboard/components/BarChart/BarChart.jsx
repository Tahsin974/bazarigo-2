import React from "react";

const BarChart = ({ data = [] }) => {
  if (!data.length)
    return (
      <div className="h-28 flex items-center justify-center text-gray-400">
        No data
      </div>
    );
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  return (
    <div className="flex items-end gap-3 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 text-center">
          <div
            className="mx-auto rounded-md"
            style={{
              height: `${((Number(d.value) || 0) / max) * 100}%`,
              width: "70%",
            }}
          >
            <div className="h-full w-full bg-gradient-to-b from-[#FF7B7B] to-[#FF0055] rounded-md"></div>
          </div>
          <div className="mt-2 text-xs text-gray-600">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
