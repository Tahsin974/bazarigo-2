import React from "react";
import { useState } from "react";

export default function VariantSelection({ product }) {
  // Variant selection state
  const [selectedVariant, setSelectedVariant] = useState({});

  // Example variant data: product.variants = { size: ["S", "M", "L"], color: ["Red", "Blue"] }
  const variants = product.variants || {};

  //   // Handle Add to Cart
  //   const handleAddToCart = () => {
  //     console.log("Adding to cart with variants:", selectedVariant);
  //     alert(
  //       `Added to cart: ${product.name} (Variants: ${JSON.stringify(
  //         selectedVariant
  //       )})`
  //     );
  //   };
  return (
    <div>
      {Object.keys(variants).length > 0 && (
        <div className="mt-6 space-y-4">
          {Object.entries(variants).map(([variantType, options]) => (
            <div key={variantType}>
              <p className="font-medium mb-2">Select {variantType}:</p>
              <div className="flex gap-2 flex-wrap">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setSelectedVariant({
                        ...selectedVariant,
                        [variantType]: option,
                      })
                    }
                    className={`px-4 py-2 rounded-lg border transition ${
                      selectedVariant[variantType] === option
                        ? "bg-[#FF0055] text-white border-[#FF0055]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#FF0055]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
