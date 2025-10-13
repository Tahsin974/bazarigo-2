export const getExtrasByCategory = (cat) => {
  switch (cat) {
    case "Electronics":
      return [
        { key: "brand", label: "Brand" },
        { key: "warranty", label: "Warranty (e.g. 1 year)" },
        { key: "model", label: "Model" },
      ];
    case "Fashion":
      return [
        { key: "size", label: "Size (comma separated)" },
        { key: "color", label: "Color options" },
        { key: "material", label: "Material" },
      ];
    case "Groceries":
      return [
        { key: "expiry", label: "Expiry Date" },
        { key: "weight", label: "Weight/Volume" },
        { key: "organic", label: "Organic (yes/no)" },
      ];
    case "Home & Living":
      return [
        { key: "dimensions", label: "Dimensions" },
        { key: "material", label: "Material" },
        { key: "brand", label: "Brand" },
      ];
    case "Health & Beauty":
      return [
        { key: "ingredients", label: "Key Ingredients" },
        { key: "usage", label: "Usage Instructions" },
        { key: "suitableFor", label: "Suitable For" },
      ];
    case "Sports":
      return [
        { key: "sportType", label: "Sport Type" },
        { key: "brand", label: "Brand" },
        { key: "material", label: "Material" },
      ];
    default:
      return [{ key: "note", label: "Note" }];
  }
};

export function buildInventoryFromProducts(products) {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock || 0,
  }));
}
export function samplePayments() {
  return [
    {
      id: "pay1",
      date: "2025-09-20",
      amount: 120,
      method: "bKash",
      status: "Completed",
    },
    {
      id: "pay2",
      date: "2025-09-21",
      amount: 65,
      method: "Nagad",
      status: "Pending",
    },
    {
      id: "pay3",
      date: "2025-09-22",
      amount: 200,
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: "pay4",
      date: "2025-09-25",
      amount: 150,
      method: "PayPal",
      status: "Failed",
    },
    {
      id: "pay5",
      date: "2025-09-28",
      amount: 300,
      method: "Stripe",
      status: "Completed",
    },
  ];
}
