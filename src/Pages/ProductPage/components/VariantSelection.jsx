import useExtractVariants from "../../../Utils/Helpers/useExtractVariants";

export default function VariantSelection({ product, selected, setSelected }) {
  const variants = useExtractVariants(product);

  if (variants.length === 0) return null;

  const handleSelect = (variantName, option) => {
    setSelected((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  return (
    <div className="mt-6 space-y-6">
      {/* বাটন সেকশন */}
      {variants.map((variant) => (
        <div key={variant.name} className="mb-4 flex items-center gap-4">
          <h4 className="font-semibold capitalize flex-shrink-0">
            {variant.name.replace("_", " ")} :
          </h4>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(variant.name, option)}
                className={`px-3 py-1 min-w-10 rounded-full border transition-all ${
                  selected?.[variant.name] === option
                    ? "bg-[#FF0055] text-white border-[#FF0055]"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
