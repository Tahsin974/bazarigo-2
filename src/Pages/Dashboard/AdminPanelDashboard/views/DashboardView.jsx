import React from "react";
import StatCard from "../components/StatCard/StatCard";
import LineChart from "../components/LineChart/LineChart";
import BarChart from "../components/BarChart/BarChart";

function DashboardView({ products, orders, payments }) {
  const totalSales = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const recentOrders = orders.slice(0, 5);

  const salesData = [
    { label: "Mon", value: 10 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 9 },
    { label: "Thu", value: 22 },
    { label: "Fri", value: 30 },
  ];

  const categoryData = [
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Products" value={products.length} />
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Total Sales" value={`৳${totalSales.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Sales Trend</h3>
          <LineChart data={salesData} />
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Top Categories</h3>
          <BarChart data={categoryData} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Recent Orders</h3>
        <div className="space-y-2">
          {recentOrders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-xs text-gray-500">{o.customer}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">৳{o.total}</div>
                <div className="text-xs text-gray-500">
                  {o.status} • {o.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
