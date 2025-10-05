// Helper functions and sample data for Admin Panel (JSX version)
// Note: This file is now .jsx, but contains only functions and no React components.
// You can now use JSX syntax if needed in the future.

export const downloadFile = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const exportAsCSV = (rows = [], filename = "export") => {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")]
    .concat(
      rows.map((r) =>
        keys
          .map((k) => {
            const v = r[k] === undefined || r[k] === null ? "" : `${r[k]}`;
            return `"${v.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
    )
    .join("\n");

  downloadFile(`${filename}.csv`, csv, "text/csv;charset=utf-8;");
  downloadFile(
    `${filename}.xls`,
    csv,
    "application/vnd.ms-excel;charset=utf-8;"
  );
};

export const parseCSV = async (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (!lines.length) return res([]);
        const headers = lines[0].split(",").map((h) => h.trim());
        const rows = lines.slice(1).map((l) => {
          const items = l.split(",");
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = items[i] ? items[i].trim() : "";
          });
          return obj;
        });
        res(rows);
      } catch (e) {
        rej(e);
      }
    };
    reader.onerror = rej;
    reader.readAsText(file);
  });
};

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

export const sampleProducts = () => [
  {
    id: "p1",
    name: "Smart Watch",
    price: "199.99",
    category: "Electronics",
    description: "A smartwatch.",
    stock: 24,
    images: [],
    extras: { brand: "Acme", warranty: "1 year" },
  },
  {
    id: "p2",
    name: "Canvas Sneakers",
    price: "75",
    category: "Fashion",
    description: "Comfortable shoes.",
    stock: 40,
    images: [],
    extras: { size: "6,7,8,9", color: "black,white", material: "canvas" },
  },
  {
    id: "p3",
    name: "Insulated Mug",
    price: "25",
    category: "Home & Kitchen",
    description: "Keeps drinks hot.",
    stock: 120,
    images: [],
    extras: { material: "stainless steel" },
  },
];

export const sampleOrders = () => [
  {
    id: "o_1001",
    customer: "Alice",
    total: 199.99,
    status: "paid",
    items: [{ productId: "p1", qty: 1 }],
    date: "2025-09-25",
  },
  {
    id: "o_1002",
    customer: "Bob",
    total: 75,
    status: "processing",
    items: [{ productId: "p2", qty: 1 }],
    date: "2025-09-26",
  },
  {
    id: "o_1003",
    customer: "Carol",
    total: 50,
    status: "returned",
    items: [{ productId: "p3", qty: 2 }],
    date: "2025-09-27",
  },
];

export const sampleCustomers = () => [
  { id: "c1", name: "Alice", email: "alice@example.com", orders: 3 },
  { id: "c2", name: "Bob", email: "bob@example.com", orders: 1 },
];

export const sampleSellers = () => [
  { id: "s1", name: "Main Store", email: "store@example.com" },
];

export const samplePayments = () => [
  { id: "pay_1", method: "Card", amount: 199.99, date: "2025-09-25" },
  { id: "pay_2", method: "Cash", amount: 75, date: "2025-09-26" },
];

export const samplePromos = () => [
  {
    id: "promo1",
    code: "WELCOME10",
    discount: "10%",
    active: true,
    start: "2025-09-01",
    end: "2025-12-31",
  },
];
