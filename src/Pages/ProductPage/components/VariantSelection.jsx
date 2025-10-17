import { useState } from "react";
import useExtractVariants from "../../../Utils/Hooks/useExtractVariants";

export default function VariantSelection({ product }) {
  const variants = useExtractVariants(product);
  const [selected, setSelected] = useState({});

  if (variants.length === 0) return null; // No variants for this product

  const handleSelect = (variantName, option) => {
    setSelected((prev) => ({ ...prev, [variantName]: option }));
  };

  return (
    <div className="mt-6 ">
      {variants.map((variant) => (
        <div key={variant.name} className="mb-4">
          <h4 className="font-semibold mb-2 capitalize">{variant.name}</h4>
          <div className="flex gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(variant.name, option)}
                className={`px-4 py-2 rounded border ${
                  selected[variant.name] === option
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
