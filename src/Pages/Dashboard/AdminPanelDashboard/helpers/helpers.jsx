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

export const sampleCustomers = () => [
  { id: "c1", name: "Alice", email: "alice@example.com", orders: 3 },
  { id: "c2", name: "Bob", email: "bob@example.com", orders: 1 },
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
