export default function AddBtn({ btnHandler, children }) {
  return (
    <div>
      <button
        onClick={btnHandler}
        className="inline-flex items-center gap-2 bg-[#00C853] hover:bg-[#00B34A] text-white px-4 py-2 rounded shadow"
      >
        {children}
      </button>
    </div>
  );
}
