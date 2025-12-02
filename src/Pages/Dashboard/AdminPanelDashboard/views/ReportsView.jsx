import { useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SelectField from "../../../../components/ui/SelectField";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Utils/Hooks/useAxiosSecure";
import Loading from "../../../../components/Loading/Loading";
import DatePicker from "react-datepicker";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import Pagination from "../../../../components/ui/Pagination";

function ReportsView({ payments, customers }) {
  const axiosSecure = useAxiosSecure();
  const [reportType, setReportType] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productsCommissionDataPage, setProductsCommissionDataPage] =
    useState(1);
  const [sellerCommissionDataPage, setSellerCommissionDataPage] = useState(1);

  const { data: reports = [], isPending } = useQuery({
    queryKey: ["admin-reports", reportType, startDate, endDate],
    queryFn: async () => {
      const formattedStart = startDate
        ? new Date(startDate).toISOString().split("T")[0]
        : "";
      const formattedEnd = endDate
        ? new Date(endDate).toISOString().split("T")[0]
        : "";
      const res = await axiosSecure.get(
        `/admin-reports?interval=${reportType}&startDate=${formattedStart}&endDate=${formattedEnd}`
      );
      return res.data;
    },
  });

  const totalPagesForProductsCommission = Math.max(
    1,
    Math.ceil(reports.productCommissionData?.length / 6)
  );
  const totalPages = Math.max(
    1,
    Math.ceil(reports.productCommissionData?.length / 6)
  );
  const renderPageNumbersForProductsCommission = useRenderPageNumbers(
    productsCommissionDataPage,
    totalPagesForProductsCommission,
    setProductsCommissionDataPage
  );
  const renderPageNumbers = useRenderPageNumbers(
    sellerCommissionDataPage,
    totalPages,
    setSellerCommissionDataPage
  );
  const paginatedProductsCommissionData = reports.productCommissionData?.slice(
    (productsCommissionDataPage - 1) * 6,
    productsCommissionDataPage * 6
  );
  const paginatedSellerCommissionData = reports.sellerCommissionData?.slice(
    (sellerCommissionDataPage - 1) * 6,
    sellerCommissionDataPage * 6
  );

  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h3 className="font-semibold text-xl">Reports & Analytics</h3>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText={"Select Start Date"}
                className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-3"
              />
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholderText={"Select End Date"}
                className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-3"
              />
              <SelectField
                selectValue={reportType}
                selectValueChange={(e) => setReportType(e.target.value)}
                className="w-full md:w-auto border px-3 py-2 rounded"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </SelectField>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              Revenue
              <div className="text-2xl font-bold mt-2">
                ৳{(reports.revenue || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              Orders
              <div className="text-2xl font-bold mt-2">
                {reports.totalOrders}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              Customers
              <div className="text-2xl font-bold mt-2">{customers?.length}</div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              Sellers
              <div className="text-2xl font-bold mt-2">
                {reports.totalSellers}
              </div>
            </div>
          </div>
          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h4 className="font-medium mb-2">Average Order Value</h4>
              <div className="text-2xl font-bold">
                ৳{reports.averageOrderValue.toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow-sm text-center">
              <h4 className="font-medium mb-2">Total Payments</h4>
              <div className="text-2xl font-bold">{payments?.length}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-white p-4 rounded shadow-sm">
              <h3 className="font-semibold mb-2">Orders Trend (Weekly)</h3>
              {reports.ordersByDay?.length ? (
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer>
                    <LineChart data={reports.ordersByDay}>
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  No orders data available
                </div>
              )}
            </div>

            <div
              className="bg-white p-4 rounded shadow-sm "
              style={{ width: "100%", minHeight: 250 }}
            >
              <h3 className="font-semibold mb-2">Products by Category</h3>
              {reports.categoryData?.length ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  style={{ outline: "none" }}
                  margin={{ top: 20, right: 20, left: 2, bottom: 20 }}
                >
                  <BarChart data={reports.categoryData} barCategoryGap="20%">
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#FF7B7B" />{" "}
                        {/* Tailwind from-[#FF7B7B] */}
                        <stop offset="100%" stopColor="#FF0055" />{" "}
                        {/* Tailwind to-[#FF0055] */}
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="label" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)" // Gradient fill applied
                      radius={[6, 6, 0, 0]}
                      minPointSize={3}
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  No products data available
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="bg-white p-4 rounded shadow-sm "
              style={{ width: "100%", minHeight: 250 }}
            >
              <h3 className="font-semibold mb-2">
                Seller Performance (Products Listed)
              </h3>
              {reports.sellerPerformance?.length ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  style={{ outline: "none" }}
                  margin={{ top: 20, right: 20, left: 2, bottom: 20 }}
                >
                  <BarChart
                    data={reports.sellerPerformance}
                    barCategoryGap="20%"
                  >
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#FF7B7B" />{" "}
                        {/* Tailwind from-[#FF7B7B] */}
                        <stop offset="100%" stopColor="#FF0055" />{" "}
                        {/* Tailwind to-[#FF0055] */}
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="label" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)" // Gradient fill applied
                      radius={[6, 6, 0, 0]}
                      minPointSize={3}
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  No seller data available
                </div>
              )}
            </div>
            <div
              className="bg-white p-4 rounded shadow-sm "
              style={{ width: "100%", minHeight: 250 }}
            >
              <h3 className="font-semibold mb-2">Top Selling Products</h3>
              {reports.topSellingProducts?.length ? (
                <ResponsiveContainer
                  width="100%"
                  height={250}
                  style={{ outline: "none" }}
                  margin={{ top: 20, right: 20, left: 2, bottom: 20 }}
                >
                  <BarChart
                    data={reports.topSellingProducts}
                    barCategoryGap="20%"
                  >
                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#FF7B7B" />{" "}
                        {/* Tailwind from-[#FF7B7B] */}
                        <stop offset="100%" stopColor="#FF0055" />{" "}
                        {/* Tailwind to-[#FF0055] */}
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="label" type="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="url(#barGradient)" // Gradient fill applied
                      radius={[6, 6, 0, 0]}
                      minPointSize={3}
                      barSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  No selling products data available
                </div>
              )}
            </div>
            {/* Seller Commission Table */}
            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-semibold mb-2">Seller Commissions</h3>
              {reports.productCommissionData?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  No Products Found
                </div>
              ) : (
                <div className="overflow-x-auto rounded-box shadow-sm">
                  <table className="table  text-center">
                    <thead className="text-black">
                      <tr className="">
                        <th>Seller Name</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th> Unit Price</th>
                        <th> Quantity</th>
                        <th> Total Price</th>
                        <th>Commission Rate</th>
                        <th>Commission Amount</th>
                        <th>Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProductsCommissionData.map((p, idx) => (
                        <tr key={idx} className="border-t">
                          <td>{p.sellerName ? p.sellerName : "-"}</td>
                          <td>{p.productName}</td>
                          <td>{p.category}</td>
                          <td>৳{(p.price || 0).toLocaleString("en-IN")}</td>
                          <td>{p.quantity}</td>
                          <td>
                            {((p.price || 0) * p.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>{p.commissionRate * 100}%</td>
                          <td>
                            ৳
                            {(p.commissionAmount * p.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                          <td>
                            ৳
                            {(p.sellerEarnings * p.quantity).toLocaleString(
                              "en-IN"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <Pagination
                currentPage={productsCommissionDataPage}
                totalPages={totalPagesForProductsCommission}
                setCurrentPage={setProductsCommissionDataPage}
                renderPageNumbers={renderPageNumbersForProductsCommission}
              />
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-semibold mb-2">Seller Commission Summary</h3>

              {reports.sellerCommissionData?.length === 0 ? (
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
                      {paginatedSellerCommissionData.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.sellerName || "-"}</td>
                          <td>৳{s.totalSales.toLocaleString("en-IN")}</td>
                          <td>৳{s.totalCommission.toLocaleString("en-IN")}</td>
                          <td>৳{s.totalEarnings.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-center mt-2">
                <Pagination
                  currentPage={sellerCommissionDataPage}
                  totalPages={totalPages}
                  setCurrentPage={setSellerCommissionDataPage}
                  renderPageNumbers={renderPageNumbers}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportsView;
