import { Download } from "lucide-react";

export default function ExportBtn({ exportBtnHandler }) {
  return (
    <div>
      <button
        onClick={exportBtnHandler}
        className="flex items-center gap-1 bg-[#F59E0B] hover:bg-[#D97706]  text-white btn  border-none shadow-none rounded sm:text-base text-xs"
      >
        <Download size={16} /> Export
      </button>
    </div>
  );
}
