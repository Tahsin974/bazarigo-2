export default function useExtractVariants(product) {
  const extras = product?.extras || {};

  const variantKeys = Object.keys(extras).filter((key) =>
    Array.isArray(extras[key])
  );

  if (variantKeys.length === 0) return [];

  return variantKeys.map((key) => ({
    name: key,
    options: extras[key],
  }));
}
