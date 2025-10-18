import { motion } from "framer-motion";
import { Download } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import SelectField from "../../../../components/ui/SelectField";
export default function ReportsView({
  active,
  totalRevenue,
  reportFilter,
  setReportFilter,
  filteredOrdersForReport,
  revenueBreakdown,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  topProducts,
}) {
  const revenueByMonth = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 7500 },
    { month: "Jul", revenue: 6200 },
    { month: "Aug", revenue: 8000 },
    { month: "Sep", revenue: 7100 },
    { month: "Oct", revenue: totalRevenue }, // Include current data for this month
  ];

  const categorySales = revenueBreakdown(filteredOrdersForReport);

  return (
    <div>
      {active === "Reports" && (
        <>
          <div className="space-y-12">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Business Overview Reports
              </h3>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2  focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm"
                />
              </div>
              <SelectField
                selectValue={reportFilter}
                selectValueChange={(e) => setReportFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </SelectField>
            </div>

            {/* Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Monthly Revenue
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={revenueByMonth}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#FF0055"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Sales Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Sales by Category
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySales}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]}
                    />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Top 5 Products (by Estimated Inventory Value)
              </h4>
              <div className="overflow-x-auto bg-white rounded-box shadow-sm">
                <table className="table  text-center">
                  <thead className="text-black">
                    <tr>
                      {[
                        "Product Name",
                        "Category",
                        "Price",
                        "Stock",
                        "Inventory Value",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topProducts.map((p, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {p.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ৳{p.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {p.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#FF0055]">
                          ৳{p.potentialValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
