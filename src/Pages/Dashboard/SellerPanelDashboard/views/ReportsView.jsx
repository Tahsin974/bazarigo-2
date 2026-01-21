import { useState } from "react";
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
import Swal from "sweetalert2";
import { Printer } from "lucide-react";

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
        `/seller-reports/${user.id}?interval=${interval}&startDate=${formattedStart}&endDate=${formattedEnd}&status=${reportFilter}`,
      );
      return res.data;
    },
    enabled: !!user?.id,
  });

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
      "width=900,height=650",
    );

    printWindow.document.write(`
 <html>
 <head>
   <meta charset="UTF-8">
   <title>Bazarigo</title>
   <style>
     body {
       font-family: Arial, sans-serif;
       margin: 20px;
       line-height: 1.5;
       color: #333;
       
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
  
     
      margin:50% 50px ;
      text-align: center;
    }



       h2,h3,h4,h5{
     font-size: 30px;
    
     text-align: center;
     }

     .table-container {
      
      margin: 30px 50px;
      text-align: center;
    }
    
 
   </style>
 </head>
 
 <body>
  
 
   
 
   <section class="chart-container ">
     ${reportContent.querySelector("#revenue-chart")?.outerHTML || ""}
   </section>
 
   <section class="chart-container page-break">
     ${reportContent.querySelector("#sales-by-category")?.outerHTML || ""}
   </section>
 
   
 
   <section class="table-container page-break">
     ${reportContent.querySelector("#top-products")?.outerHTML || ""}
   </section>
 
   <section class="table-container page-break">
  
     ${
       reportContent.querySelector("#seller-commissions-products")?.outerHTML ||
       ""
     }
   </section>
 
   <section class="table-container page-break">
     
     ${
       reportContent.querySelector("#seller-commissions-summary")?.outerHTML ||
       ""
     }
   </section>
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
      timer: 800,
    });
  };

  return (
    <div>
      {active === "Reports" && (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <section id="report-content" className="space-y-6">
              {/* Header & Filters */}
              <div className="flex md:flex-row flex-col  items-center gap-5 justify-center">
                <div className="flex gap-5">
                  <div className="w-full relative">
                    <div className="relative  ">
                      <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        placeholderText="Start: DD-MM-YYYY"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                        popperPlacement="bottom-start"
                      />
                    </div>
                  </div>
                  <div className="w-full relative">
                    <div className="relative  ">
                      <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        placeholderText="End: DD-MM-YYYY"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-[#FF0055] focus:ring-2 focus:ring-[#FF0055] focus:outline-none shadow-sm bg-white m-0"
                        popperPlacement="bottom-start"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
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
              <div className="flex justify-end">
                <button
                  onClick={handlePrint}
                  title="Print Reports"
                  className="px-3  font-semibold rounded  transition-all transform hover:scale-[1.03] text-gray-700 hover:text-[#FF0055] flex items-center gap-2  "
                >
                  <Printer size={25} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div
                    id="revenue-chart"
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    <h4 className="text-lg font-semibold mb-4 text-gray-800">
                      Revenue
                    </h4>
                    {reports.revenueByInterval?.length ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={reports.revenueByInterval}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
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
                  <div
                    id="sales-by-category"
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
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
                <div
                  id="top-products"
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
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
                              <th key={header} className="px-4 py-3">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reports.topProducts.map((p, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <span className="font-semibold">{p.name}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="font-semibold">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="font-semibold">
                                  ৳{p.price.toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                <span className="font-semibold">{p.stock}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                <span className="font-semibold">
                                  ৳{p.potentialValue.toLocaleString("en-IN")}
                                </span>
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
                <div
                  id="seller-commissions-products"
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
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
                              <td>
                                <span className="font-semibold">
                                  {p.productName}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.category}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{p.price.toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.quantity}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳{(p.amount || 0).toLocaleString("en-IN")}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {p.commissionRate * 100}%
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  {" "}
                                  ৳
                                  {(p.commissionAmount || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </td>
                              <td>
                                <span className="font-semibold">
                                  ৳
                                  {(p.sellerEarnings || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Seller Commission Summary */}
                <div
                  id="seller-commissions-summary"
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
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
                              <td>
                                <span className="font-semibold">
                                  {s.sellerName}
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
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
