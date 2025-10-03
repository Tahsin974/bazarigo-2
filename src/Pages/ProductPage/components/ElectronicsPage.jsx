import BaseProductDetails from "./BaseProductDetails";

export default function ElectronicsPage({ product = {} }) {
  console.log("ElectronicsPage product:", product);
  const extra = (
    <>
      {product.brand && (
        <p>
          <strong>Brand:</strong> {product.brand}
        </p>
      )}
      {product.model && (
        <p>
          <strong>Model:</strong> {product.model}
        </p>
      )}
      {product.specs && (
        <p>
          <strong>Specifications:</strong> {product.specs}
        </p>
      )}
    </>
  );
  return <BaseProductDetails product={product} extraDetails={extra} />;
}
