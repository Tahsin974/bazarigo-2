export default function useExtractVariants(product) {
  const extras = product?.extras || {};

  const variantKeys = Object.keys(extras).filter((key) =>
    Array.isArray(extras[key])
  );
  console.log("varients", variantKeys);

  if (variantKeys.length === 0) return [];

  return variantKeys.map((key) => ({
    name: key,
    options: extras[key],
  }));
}
