import { Trash2 } from "lucide-react";

export default function DeleteAllBtn({ selected, bulkDelete }) {
  return (
    <div>
      {!selected.length ? (
        <button
          className="bg-gray-300 text-gray-500
          px-3 py-2 inline-flex items-center gap-2   border-none  rounded shadow sm:text-base text-[12px]
          "
          disabled="disabled"
        >
          <span>
            <Trash2 />
          </span>{" "}
          <span>Delete</span>
        </button>
      ) : (
        <button
          onClick={bulkDelete}
          className=" bg-[#DC2626] hover:bg-[#B91C1C] px-3 py-2 inline-flex items-center gap-2  text-white  border-none  rounded shadow sm:text-base text-[14px] cursor-pointer"
        >
          <span>
            <Trash2 />
          </span>
          <span>Delete</span>
        </button>
      )}
    </div>
  );
}
