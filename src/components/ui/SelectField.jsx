import { ChevronDown } from "lucide-react";

export default function SelectField({
  selectValue,
  selectValueChange,
  isWide = false,
  children,
}) {
  return (
    <div
      className={`relative inline-flex items-center ${isWide && "w-full"}  `}
    >
      <select
        value={selectValue}
        onChange={selectValueChange}
        className={`appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-base font-medium text-gray-900 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055] transition duration-150 cursor-pointer ${
          isWide && "w-full"
        }`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
    </div>
  );
}
