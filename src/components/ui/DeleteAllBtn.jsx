import { Trash2 } from "lucide-react";

export default function DeleteAllBtn({ selected, bulkDelete }) {
  return (
    <div>
      {!selected.length ? (
        <button
          className="bg-gray-300 text-gray-500 flex items-center gap-2 px-3 py-2 rounded  border-none shadow-none sm:text-base text-xs"
          disabled="disabled"
        >
          <span>
            <Trash2 className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]" />
          </span>{" "}
          <span>Delete All</span>
        </button>
      ) : (
        <button
          onClick={bulkDelete}
          className="px-3 py-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center gap-2  border-none shadow-none sm:text-base text-xs"
        >
          <span>
            <Trash2 className="sm:text-base text-xs" />
          </span>
          <span>Delete All</span>
        </button>
      )}
    </div>
  );
}
