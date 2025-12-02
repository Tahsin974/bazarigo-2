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
import useAxiosSecure from "../../../../Utils/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Utils/Hooks/useAuth";
import Loading from "../../../../components/Loading/Loading";

export default function DashboardView({ active }) {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: dashboard = [], isPending } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-dashboard/${user.id}`);
      return res.data;
    },
  });

  const pieData =
    dashboard.ordersByStatus?.map((item, i) => ({
      status: item.status,
      count: Number(item.count),
      color: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"][i % 4],
    })) || [];

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <div>
          {active === "Dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md">
                  <div className="text-sm text-gray-500">Products</div>
                  <div className="text-2xl font-bold">
                    {dashboard?.totalProducts}
                  </div>
                </div>
                <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md">
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="text-2xl font-bold">
                    {dashboard?.totalOrders}
                  </div>
                </div>
                <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md">
                  <div className="text-sm text-gray-500">Revenue</div>
                  <div className="text-2xl font-bold">
                    ৳{dashboard?.revenue.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-3">Recent Orders</h3>
                  {dashboard.recentOrders?.length ? (
                    <ul className="space-y-2">
                      {dashboard?.recentOrders.map((o) => (
                        <li
                          key={o.order_id}
                          className="p-3 border rounded flex justify-between"
                        >
                          <div>
                            <div className="font-medium">{o.order_id}</div>
                            <div className="text-xs text-gray-500">
                              {o.customer_name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ৳{o.total.toLocaleString("en-IN")}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(o.order_date).toLocaleDateString(
                                "en-GB"
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No sales data available
                    </div>
                  )}
                </div>

                {/* Low Stock */}
                <div className="bg-white sm:p-6 p-3 rounded-lg shadow-md">
                  <h3 className="font-semibold mb-3">Low Stock Items</h3>

                  {dashboard?.lowStock?.length ? (
                    <ul className="space-y-2">
                      {dashboard.lowStock.map((i) => (
                        <li
                          key={i.id}
                          className="p-3 border rounded flex justify-between"
                        >
                          <h2>{i.product_name}</h2>

                          <p className="text-sm">{i.stock}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No Low Stock Items
                    </div>
                  )}
                </div>
              </div>

              {/* Sales Chart */}
              <div className="flex flex-col gap-6 my-4">
                <div className="flex-1 bg-white p-4 rounded shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Last 7 Days Sales Trend
                  </h4>

                  {dashboard.salesData?.length ? (
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <AreaChart
                          data={dashboard.salesData}
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
                              <stop
                                offset="5%"
                                stopColor="#4F46E5"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4F46E5"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              `৳${value.toLocaleString("en-IN")}`,
                              "Revenue",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#4F46E5"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No sales data available
                    </div>
                  )}
                </div>
                {/* Order Status Pie Chart */}
                <div className="flex-1 bg-white p-4 rounded shadow-sm">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Order Status Distribution
                  </h4>
                  {pieData?.length ? (
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="count" // ➜ numeric value
                            nameKey="status" // ➜ label text
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            label={(entry) => `${entry.status}: ${entry.count}`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>

                          <Tooltip
                            formatter={(value, name, props) => [
                              `${props.payload.count}`,
                              "Count",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No sales data available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
}
