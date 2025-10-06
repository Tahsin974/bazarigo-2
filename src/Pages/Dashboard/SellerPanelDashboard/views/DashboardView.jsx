import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts";
export default function DashboardView({
  active,
  products,
  orders,
  inventory,
  salesData,
}) {
  const ordersByStatus = (list) => {
    const map = {};
    list.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ status: k, count: map[k] }));
  };
  const ordersData = ordersByStatus(orders);

  const pieData = ordersData.map((d, i) => ({
    name: d.status,
    value: d.count,
    color: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"][i % 4],
  }));
  console.log(salesData);

  return (
    <div>
      {active === "Dashboard" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm text-gray-500">Products</div>
              <div className="text-2xl font-bold">{products.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm text-gray-500">Orders</div>
              <div className="text-2xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-sm text-gray-500">Revenue</div>
              <div className="text-2xl font-bold">
                ${orders.reduce((a, b) => a + (b.total || 0), 0)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1  gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3">Recent Orders</h3>
              <ul className="space-y-2">
                {orders.slice(0, 6).map((o) => (
                  <li
                    key={o.id}
                    className="p-3 border rounded flex justify-between"
                  >
                    <div>
                      <div className="font-medium">{o.number || o.id}</div>
                      <div className="text-sm text-gray-500">
                        {o.customer || "—"}
                      </div>
                    </div>
                    <div className="text-sm">${o.total}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold mb-3">Low Stock Items</h3>
              <ul className="space-y-2">
                {inventory
                  .filter((i) => i.stock < 5)
                  .slice(0, 6)
                  .map((i) => (
                    <li
                      key={i.id}
                      className="p-3 border rounded flex justify-between"
                    >
                      <div>{i.name}</div>
                      <div className="text-sm">{i.stock}</div>
                    </li>
                  ))}
                {inventory.filter((i) => i.stock < 5).length === 0 && (
                  <div className="text-sm text-gray-500">
                    No low-stock items
                  </div>
                )}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1  gap-6 my-4">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Last 7 Days Sales Trend
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Order Status Distribution
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
