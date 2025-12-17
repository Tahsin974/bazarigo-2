export default function AddBtn({
  btnHandler,
  bgColor = "#00C853",
  bgColorHover = "#00B34A",
  children,
  disabled = false,
}) {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={btnHandler}
        className={`px-3 py-2 inline-flex items-center gap-2 bg-[${bgColor}] hover:bg-[${bgColorHover}] disabled:bg-gray-300 disabled:text-gray-500 text-white  border-none  rounded shadow sm:text-base text-[14px] cursor-pointer`}
      >
        {children}
      </button>
    </div>
  );
}
