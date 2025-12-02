import React, { useState } from "react";
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
import useAuth from "../../../../Utils/Hooks/useAuth";
import useAxiosSecure from "../../../../Utils/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import Loading from "../../../../components/Loading/Loading";

export default function ReportsView({ active }) {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [reportFilter, setReportFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interval, setInterval] = useState("monthly"); // weekly | monthly

  const { data: reports = [], isLoading } = useQuery({
    queryKey: [
      "seller-reports",
      user?.id,
      interval,
      startDate,
      endDate,
      reportFilter,
    ],
    queryFn: async () => {
      const formattedStart = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "";
      const formattedEnd = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "";
      const res = await axiosSecure.get(
        `/seller-reports/${user.id}?interval=${interval}&startDate=${formattedStart}&endDate=${formattedEnd}&status=${reportFilter}`
      );
      return res.data;
    },
    enabled: !!user?.id,
  });
  console.log(reports);

  // Whenever `reports` changes, update state for charts and table

  return (
    <div>
      {active === "Reports" && (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-12">
              {/* Header & Filters */}
              <div className="flex justify-center items-center ">
                <div className="flex gap-5">
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    placeholderText={"Select Start Date"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    placeholderText={"Select End Date"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                  />
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
                  <SelectField
                    selectValue={interval}
                    selectValueChange={(e) => setInterval(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </SelectField>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Revenue
                  </h4>
                  {reports.revenueByInterval?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={reports.revenueByInterval}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" />
                        <YAxis
                          tickFormatter={(value) =>
                            Intl.NumberFormat("en", {
                              style: "currency",
                              currency: "BDT",
                              maximumFractionDigits: 0,
                            }).format(value)
                          }
                        />
                        <Tooltip
                          formatter={(value) =>
                            Intl.NumberFormat("en", {
                              style: "currency",
                              currency: "BDT",
                            }).format(value)
                          }
                        />
                        <Bar
                          dataKey="revenue"
                          barSize={50}
                          fill="#FF0055"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-white py-20 text-gray-400">
                      No revenue data available
                    </div>
                  )}
                </div>

                {/* Category Sales Pie */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Sales by Category
                  </h4>
                  {reports.categorySales?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={reports.categorySales}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label
                        >
                          {reports.categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            Intl.NumberFormat("en", {
                              style: "currency",
                              currency: "BDT",
                            }).format(value)
                          }
                        />
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-white py-20 text-gray-400">
                      No category Sales data available
                    </div>
                  )}
                </div>
              </div>

              {/* Top Products Table */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Top 5 Products
                </h4>
                {reports.topProducts?.length ? (
                  <div className="overflow-x-auto bg-white rounded-box shadow-sm">
                    <table className="table text-center">
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
                        {reports.topProducts.map((p, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {p.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {p.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ৳{p.price}
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
                ) : (
                  <div className="flex flex-col items-center justify-center bg-white py-20 text-gray-400">
                    No Products Found
                  </div>
                )}
              </div>

              {/* Seller Commission Table */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Seller Commissions
                </h4>
                {reports.productCommissionData?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    No Products Found
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-box shadow-sm">
                    <table className="table text-center">
                      <thead className="text-black">
                        <tr>
                          <th>Product Name</th>
                          <th>Category</th>
                          <th>Unit Price</th>
                          <th>Quantity</th>
                          <th>Total Price</th>
                          <th>Commission Rate</th>
                          <th>Commission Amount</th>
                          <th>Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.productCommissionData.map((p, idx) => (
                          <tr key={idx} className="border-t">
                            <td>{p.productName}</td>
                            <td>{p.category}</td>
                            <td>৳{p.price.toLocaleString("en-IN")}</td>
                            <td>{p.quantity}</td>
                            <td>
                              ৳{(p.totalPrice || 0).toLocaleString("en-IN")}
                            </td>
                            <td>{p.commissionRate * 100}%</td>
                            <td>
                              ৳
                              {(p.commissionAmount || 0).toLocaleString(
                                "en-IN"
                              )}
                            </td>
                            <td>
                              ৳{(p.sellerEarnings || 0).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Seller Commission Summary */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Seller Commission Summary
                </h4>
                {!reports.sellerCommissionData?.length ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    No Seller Commissions Found
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-box shadow-sm">
                    <table className="table text-center">
                      <thead className="text-black">
                        <tr>
                          <th>Seller Name</th>
                          <th>Total Sales</th>
                          <th>Total Commission</th>
                          <th>Seller Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.sellerCommissionData.map((s, idx) => (
                          <tr key={idx}>
                            <td>{s.sellerName}</td>
                            <td>৳{s.totalSales.toLocaleString("en-IN")}</td>
                            <td>
                              ৳{s.totalCommission.toLocaleString("en-IN")}
                            </td>
                            <td>৳{s.totalEarnings.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
