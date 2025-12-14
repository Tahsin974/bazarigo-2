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

import Swal from "sweetalert2";
import { Printer } from "lucide-react";

function ReportsView({ payments, customers }) {
  const axiosSecure = useAxiosSecure();

  const [reportType, setReportType] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrint = () => {
    const reportContent = document.getElementById("report-content");

    if (!reportContent) {
      Swal.fire({
        icon: "error",
        title: "Unable to find printable content. Please try again.",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const printWindow = window.open(
      "data:text/html;charset=utf-8,",
      "",
      "width=900,height=650"
    );

    printWindow.document.write(`
<html>
<head>
  <meta charset="UTF-8">
  <title>Bazarigo</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: Arial, sans-serif;
    }

    body {
      display: table;
      width: 100%;
      height: 100%;
      text-align: center; /* horizontal centering */
      
    }

    .container {
      display: table-cell;
      vertical-align: middle; /* vertical centering */
      padding-block: 100px;
      
    }

    

    section {
      margin-bottom: 30px;
      width: 90%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .card {
      background-color: #ffffff;
      padding: 1rem;
      border-radius: 0.25rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      text-align: center;
      border:0.5px solid gray;
    }

    .page-break {
      page-break-before: always;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
      font-size: 12px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 4px;
      text-align: center;
    }

    th {
      background-color: rgb(240, 240, 240);
      color: black;
    }

    tr {
      border-bottom: 1px solid #d1d5dc;
    }

    .chart-container {
  
     padding-right:500px;
      margin:50% 50px ;
      text-align: center;
    }
      .table-container {
      padding-block: 100px;
      margin: 30px 50px;
      text-align: center;
    }


    h2,h3{
     font-size: 30px;
     padding-bottom:40px;
     }
     .card-title {
        font-size: 0.75rem;
        text-transform: uppercase;
        margin-bottom: 8px;
        font-family: "Roboto";
        font-weight: 400;
      }
  </style>
</head>
<body>
  <div class="container">
    

    <section>
      <h2>Reports Summary</h2>
      <div class="card-container">
        <div class="card"><div class="card-title">Revenue</div><div class="card-value">৳${(
          reports.revenue || 0
        ).toLocaleString("en-IN")}</div></div>
        <div class="card"><div class="card-title">Orders</div><div class="card-value">${
          reports.totalOrders
        }</div></div>
        <div class="card"><div class="card-title">Customers</div><div class="card-value">${
          customers?.length
        }</div></div>
        <div class="card"><div class="card-title">Sellers</div><div class="card-value">${
          reports.totalSellers
        }</div></div>
        <div class="card"><div class="card-title">Average Order Value</div><div class="card-value">৳${
          reports.averageOrderValue?.toFixed(2) || 0
        }</div></div>
        <div class="card"><div class="card-title">Total Payments</div><div class="card-value">${
          payments?.length || 0
        }</div></div>
      </div>
    </section>

    <section class="chart-container page-break">
      ${reportContent.querySelector("#orders-trend-chart")?.outerHTML || ""}
    </section>

    <section class="chart-container page-break">
      ${
        reportContent.querySelector("#products-category-chart")?.outerHTML || ""
      }
    </section>

    <section class="chart-container page-break">
      ${reportContent.querySelector("#seller-perfomance")?.outerHTML || ""}
    </section>

    <section class="chart-container page-break">
      ${reportContent.querySelector("#top-selling-products")?.outerHTML || ""}
    </section>

    <section class="table-container page-break">
      <h3>Seller Commissions</h3>
      ${
        reportContent.querySelector("#seller-commissions-products")
          ?.outerHTML || ""
      }
    </section>

    <section class="table-container page-break">
      <h3>Seller Commission Summary</h3>
      ${
        reportContent.querySelector("#seller-commissions-summary")?.outerHTML ||
        ""
      }
    </section>
  </div>
</body>
</html>
`);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);

    Swal.fire({
      icon: "error",
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 1500,
    });
  };

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
          <div className="flex justify-end">
            <button
              onClick={handlePrint}
              title="Print Reports"
              className="px-3 py-3 font-semibold rounded  transition-all transform hover:scale-[1.03] text-gray-700 hover:text-[#FF0055] flex items-center gap-2  "
            >
              <Printer size={25} />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="font-semibold text-xl">Reports & Analytics</h3>

              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  placeholderText={"Select Start Date"}
                  className="w-full md:w-auto  px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                  portalId="root"
                />
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  placeholderText={"Select End Date"}
                  className="w-full md:w-auto  px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF0055]"
                  portalId="root"
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

            <div id="report-content" className="space-y-6">
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
                  <div className="text-2xl font-bold mt-2">
                    {customers?.length}
                  </div>
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
                    ৳
                    {reports.averageOrderValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm text-center">
                  <h4 className="font-medium mb-2">Total Payments</h4>
                  <div className="text-2xl font-bold">{payments?.length}</div>
                </div>
              </div>

              {/* Charts */}
              <div className="flex flex-col gap-4">
                <div
                  id="orders-trend-chart"
                  className="flex-1 bg-white p-4 rounded shadow-sm"
                >
                  <h3 className="font-semibold mb-6 capitalize">
                    Orders Trend Chart ({reportType})
                  </h3>
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
                  id="products-category-chart"
                  className="bg-white p-4 rounded shadow-sm "
                  style={{ width: "100%", minHeight: 250 }}
                >
                  <h3 className="font-semibold mb-6">
                    {" "}
                    Product Sales by Category Chart
                  </h3>
                  {reports.categoryData?.length ? (
                    <ResponsiveContainer
                      width="100%"
                      height={250}
                      style={{ outline: "none" }}
                      margin={{ top: 20, right: 20, left: 2, bottom: 20 }}
                    >
                      <BarChart
                        data={reports.categoryData}
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
                      No products data available
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div
                  id="seller-perfomance"
                  className="bg-white p-4 rounded shadow-sm "
                  style={{ width: "100%", minHeight: 250 }}
                >
                  <h3 className="font-semibold mb-6">
                    Seller Performance Chart
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
                  id="top-selling-products"
                  className="bg-white p-4 rounded shadow-sm "
                  style={{ width: "100%", minHeight: 250 }}
                >
                  <h3 className="font-semibold mb-6">
                    {" "}
                    Top Selling Products Chart
                  </h3>
                  {reports.topSellingProducts?.length ? (
                    <ResponsiveContainer
                      width="100%"
                      height={250}
                      style={{ outline: "none" }}
                      margin={{ top: 20, right: 20, left: 2, bottom: 60 }}
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
                  <h3 className="font-semibold mb-6">
                    Seller Commissions Table
                  </h3>
                  {reports.productCommissionData?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No Products Found
                    </div>
                  ) : (
                    <div
                      id="seller-commissions-products"
                      className="overflow-x-auto rounded-box shadow-sm"
                    >
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
                              <td>
                                <span className="font-semibold">
                                  {p.sellerName ? p.sellerName : "-"}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.productName}
                                </span>{" "}
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.category}
                                </span>{" "}
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{(p.price || 0).toLocaleString("en-IN")}
                                </span>{" "}
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {" "}
                                  {p.quantity}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {((p.price || 0) * p.quantity).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.commissionRate * 100}%
                                </span>{" "}
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳
                                  {(
                                    p.commissionAmount * p.quantity
                                  ).toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳
                                  {(
                                    p.sellerEarnings * p.quantity
                                  ).toLocaleString("en-IN")}
                                </span>
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
                  <h3 className="font-semibold mb-6">
                    Seller Commission Summary Table
                  </h3>

                  {reports.sellerCommissionData?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No Seller Commissions Found
                    </div>
                  ) : (
                    <div
                      id="seller-commissions-summary"
                      className="overflow-x-auto rounded-box shadow-sm"
                    >
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
                              <td>
                                <span className="font-semibold">
                                  {s.sellerName || "-"}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{s.totalSales.toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{s.totalCommission.toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{s.totalEarnings.toLocaleString("en-IN")}
                                </span>
                              </td>
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
          </div>
        </div>
      )}
    </>
  );
}

export default ReportsView;
