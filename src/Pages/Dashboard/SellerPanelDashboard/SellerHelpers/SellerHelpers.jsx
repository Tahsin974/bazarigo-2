export function sampleProducts() {
  return [
    {
      id: "p1",
      name: "Sleek Wireless Headphones",
      category: "Electronics",
      price: 120,
      description: "High quality sound",
      images: [],
      stock: 12,
    },
    {
      id: "p2",
      name: "Stylish Canvas Backpack",
      category: "Fashion",
      price: 65,
      description: "Durable & roomy",
      images: [],
      stock: 8,
    },
    {
      id: "p3",
      name: "Automatic Drip Coffee Maker",
      category: "Home & Kitchen",
      price: 50,
      description: "Easy brew",
      images: [],
      stock: 3,
    },
    {
      id: "p4",
      name: "Premium Leather Wallet",
      category: "Fashion",
      price: 40,
      description: "Genuine leather",
      images: [],
      stock: 2,
    },
    {
      id: "p5",
      name: "Bluetooth Speaker",
      category: "Electronics",
      price: 90,
      description: "Portable",
      images: [],
      stock: 5,
    },
  ];
}
export function sampleOrders() {
  return [
    {
      orderId: "o1",
      number: "1001",
      customer: "Alice",
      total: 45.0,
      status: "Shipped",
      date: "2025-09-18",
      items: [
        { productId: "p1", qty: 2, price: 15.0 },
        { productId: "p3", qty: 1, price: 25.0 },
      ],
    },
    {
      orderId: "o2",
      number: "1002",
      customer: "Bob",
      total: 6.5,
      status: "Delivered",
      date: "2025-09-19",
      items: [{ productId: "p2", qty: 1, price: 6.5 }],
    },
    {
      orderId: "o3",
      number: "1003",
      customer: "Charlie",
      total: 50.0,
      status: "Pending",
      date: "2025-09-20",
      items: [
        { productId: "p1", qty: 3, price: 15.0 },
        { productId: "p5", qty: 1, price: 4.99 },
      ],
    },
    {
      orderId: "o4",
      number: "1004",
      customer: "Diana",
      total: 12.0,
      status: "Cancelled",
      date: "2025-09-22",
      items: [{ productId: "p4", qty: 1, price: 12.0 }],
    },
    {
      orderId: "o5",
      number: "1005",
      customer: "Eva",
      total: 29.99,
      status: "Pending",
      date: "2025-09-28",
      items: [{ productId: "p5", qty: 6, price: 4.99 }],
    },
    {
      orderId: "o6",
      number: "1006",
      customer: "Frank",
      total: 62.0,
      status: "Shipped",
      date: "2025-10-01",
      items: [
        { productId: "p3", qty: 2, price: 25.0 },
        { productId: "p4", qty: 1, price: 12.0 },
      ],
    },
  ];
}
export function sampleReturns() {
  return [
    { returnId: "r1", number: "1000", customer: "Eve", reason: "Damaged" },
  ];
}
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
