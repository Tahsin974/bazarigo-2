export default function AddBtn({ btnHandler, children }) {
  return (
    <div>
      <button
        onClick={btnHandler}
        className="px-3 py-2 inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00B34A] text-white  border-none  rounded shadow sm:text-base text-xs  "
      >
        {children}
      </button>
    </div>
  );
}
