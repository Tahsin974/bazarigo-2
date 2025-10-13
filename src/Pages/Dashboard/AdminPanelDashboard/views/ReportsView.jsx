import BarChart from "../components/BarChart/BarChart";
import LineChart from "../components/LineChart/LineChart";

function ReportsView({ products, orders, customers, sellers, payments }) {
  const revenue = payments.reduce((a, p) => a + Number(p.amount || 0), 0);
  const ordersByDay = [
    { label: "Mon", value: 10 },
    { label: "Tue", value: 14 },
    { label: "Wed", value: 8 },
    { label: "Thu", value: 22 },
    { label: "Fri", value: 18 },
  ];
  const productsByCategory = [
    {
      label: "Fashion",
      value: products.filter((p) => p.category === "Fashion").length,
    },
    {
      label: "Electronics",
      value: products.filter((p) => p.category === "Electronics").length,
    },
    {
      label: "Home",
      value: products.filter((p) => p.category === "Home & Kitchen").length,
    },
  ];
  const sellerPerformance = sellers.map((s) => ({
    label: s.name,
    value: Math.floor(products.length / Math.max(1, sellers.length)),
  }));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Reports & Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          Revenue
          <br />
          <div className="text-2xl font-bold">৳{revenue.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          Orders
          <br />
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          Customers
          <br />
          <div className="text-2xl font-bold">{customers.length}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="font-medium mb-2">Orders Trend</h4>
          <LineChart data={ordersByDay} />
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="font-medium mb-2">Products by Category</h4>
          <BarChart data={productsByCategory} />
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="font-medium mb-2">Seller Performance</h4>
        <BarChart data={sellerPerformance} />
      </div>
    </div>
  );
}

export default ReportsView;
