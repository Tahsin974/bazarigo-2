import BaseProductDetails from "./BaseProductDetails";
export default function ProductDetails({ product = {}, isPending, refetch }) {
  return (
    <BaseProductDetails
      product={product}
      isPending={isPending}
      refetch={refetch}
    />
  );
}
