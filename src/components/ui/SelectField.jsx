import { ChevronDown } from "lucide-react";

export default function SelectField({
  selectValue,
  selectValueChange,
  isWide = false,
  children,
  disabled = false,
  ...props
}) {
  let colorClass = `"bg-white border border-gray-300 ${
    disabled === true ? "text-gray-400" : "text-gray-900 hover:border-gray-400"
  }     focus:ring-2 focus:ring-[#FF0055] focus:border-[#FF0055]"`;
  switch (selectValue) {
    case "Delivered":
      colorClass = "bg-green-100 border-green-400 text-green-700";
      break;
    case "Shipped":
    case "Out for Delivery":
      colorClass = "bg-blue-100 border-blue-400 text-blue-700";
      break;
    case "Processing":
      colorClass = "bg-yellow-100 border-yellow-400 text-yellow-700";
      break;

    default:
      // default is used for "Processing" or initial state
      break;
  }
  return (
    <div
      className={`relative w-auto inline-flex items-center ${
        isWide && "w-full "
      }  `}
    >
      <select
        value={selectValue}
        onChange={selectValueChange}
        {...props}
        className={`appearance-none focus:outline-none rounded-lg py-3  pl-4 pr-10 sm:text-base text-[14px] font-medium  shadow-sm  transition duration-150 cursor-pointer  ${
          isWide && "w-full"
        } ${colorClass}`}
        style={{ fontFamily: "Poppins", fontWeight: 700 }}
        disabled={disabled}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500" />
    </div>
  );
}
