import { Trash2 } from "lucide-react";

export default function DeleteAllBtn({ selected, bulkDelete }) {
  return (
    <div>
      {!selected.length ? (
        <button
          className="px-3 py-2 rounded-md bg-gray-200 text-gray-500 flex items-center gap-2"
          disabled
        >
          <span>
            <Trash2 />
          </span>{" "}
          <span>Delete All</span>
        </button>
      ) : (
        <button
          onClick={bulkDelete}
          className="px-3 py-2 rounded-md bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center gap-2"
        >
          <span>
            {" "}
            <Trash2 />
          </span>{" "}
          <span>Delete All</span>
        </button>
      )}
    </div>
  );
}
