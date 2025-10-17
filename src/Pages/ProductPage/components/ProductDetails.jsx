import React from "react";
import BaseProductDetails from "./BaseProductDetails";
import { getExtrasByCategory } from "../../../Utils/Helpers/Helpers";

export default function ProductDetails({
  product = {},
  category,
  subcategory = "",
}) {
  const extrasConfig = getExtrasByCategory(category, subcategory);
  const extras = product.extras || {};

  // Only show fields that exist in extras
  const extraDetails = extrasConfig
    .filter(
      (item) => extras[item.key] !== undefined && extras[item.key] !== null
    )
    .map((item) => (
      <p key={item.key}>
        <strong>{item.label}:</strong> {extras[item.key]}
      </p>
    ));

  return <BaseProductDetails product={product} extraDetails={extraDetails} />;
}
