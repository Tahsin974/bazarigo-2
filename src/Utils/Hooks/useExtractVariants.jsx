export default function useExtractVariants(product) {
  const variants = product.extras?.variants || [];
  if (variants.length === 0) return [];

  // Collect all unique keys except stock, sale price, regular price
  const excludedKeys = ["stock", "sale price", "regular price"];
  const variantKeys = Object.keys(variants[0]).filter(
    (key) => !excludedKeys.includes(key)
  );

  // Map keys to their unique options
  return variantKeys.map((key) => ({
    name: key,
    options: [...new Set(variants.map((v) => v[key]))],
  }));
}
