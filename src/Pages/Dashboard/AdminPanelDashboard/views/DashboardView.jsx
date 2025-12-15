import StatCard from "../components/StatCard/StatCard";

import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import Pagination from "../../../../components/ui/Pagination";
import { CircleCheckBig, CircleX, Eye, Printer } from "lucide-react";

import Swal from "sweetalert2";
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
import useProducts from "../../../../Utils/Hooks/useProducts";
import Loading from "../../../../components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Utils/Hooks/useAxiosSecure";
import { useState } from "react";
import SelectField from "../../../../components/ui/SelectField";

function DashboardView({
  products,
  orders,

  paginatedReturnRequests,
  returnRequests,
  setReturnRequestsPage,
  returnRequestsPage,
  refetch,
  returnRequestsPageSize,
  openImageGalleryModal,
}) {
  const axiosSecure = useAxiosSecure();
  const [chartPeriod, setChartPeriod] = useState("weekly");

  const { loading } = useProducts();
  const { data: dashboard = [], isPending } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard");
      return res.data;
    },
  });

  /** Pagination */
  const totalPages = Math.max(
    1,
    Math.ceil(returnRequests.length / returnRequestsPageSize)
  );
  const renderPageNumbers = useRenderPageNumbers(
    returnRequestsPage,
    totalPages,
    setReturnRequestsPage
  );

  /** Handle Return Request */
  const handleReturnRequest = async (id, status) => {
    try {
      const res = await axiosSecure.patch(`/return-requests/status/${id}`, {
        status,
      });
      if (res.data.updatedCount > 0 || res.data.deletedCount > 0) {
        Swal.fire({
          icon: "success",
          title: `Return Request ${
            status === "approved" ? "Approved" : "Rejected"
          }`,
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      refetch();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Something went wrong",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error(err);
    }
  };
  const handlePrint = () => {
    const dashboardContent = document.getElementById("dashboard-content");

    if (!dashboardContent) {
      Swal.fire({
        icon: "error",
        title: "Unable to find printable content. Please try again.",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
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
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.5;
        color: #333;
      }
  
     
  
      section {
        margin-bottom: 30px;
      }
  
      .page-break {
    page-break-before: always;
    text-align: center;
    
      }
    
  
      .card-container {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        margin-bottom: 20px;
      }
  
      .card {
        background-color: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        text-align: center;
        border:0.5px solid gray;
      }
  
      h2,h3{
     font-size: 30px;
     padding-bottom:40px;
     }
  
      .card-value {
        font-size: 1.75rem;
        font-family: "Roboto";
        font-weight: 400;
      }
  
     .chart-container {
  
  align-items: center; 
 
      margin:50% 50px ; 
  text-align: center;
}

     
  
    </style>
  </head>
  
  <body>
   
  
   
  
    <section class="chart-container ">
    <h3 >Sales Trend</h3>
      ${dashboardContent.querySelector("#sales-trend-chart")?.outerHTML || ""}
    </section>
  
    <section class="chart-container page-break">
 
      ${
        dashboardContent.querySelector("#category-performance")?.outerHTML || ""
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
      timer: 1500,
    });
  };

  return (
    <>
      {loading || isPending ? (
        <Loading />
      ) : (
        <div>
          <div className="space-y-6">
            <div id="dashboard-content" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard title="Total Products" value={products.length} />
                <StatCard title="Total Orders" value={orders.length} />
                <StatCard
                  title="Total Sales"
                  value={`৳${dashboard.totalSales.toLocaleString("en-IN")}`}
                />
                <StatCard
                  title="Return Requests"
                  value={returnRequests.length}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handlePrint}
                  title="Print Charts"
                  className="px-3 py-3 font-semibold rounded  transition-all transform hover:scale-[1.03] text-gray-700 hover:text-[#FF0055] flex items-center gap-2  "
                >
                  <Printer size={25} />
                </button>
              </div>

              {/* Charts */}
              <div className="flex flex-col gap-6 h-min">
                <div className="flex-1 bg-white p-4 rounded shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold mb-6">Sales Trend</h3>
                    <SelectField
                      className="border rounded px-2 py-1"
                      selectValue={chartPeriod}
                      selectValueChange={(e) => setChartPeriod(e.target.value)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </SelectField>
                  </div>
                  <div id="sales-trend-chart">
                    {dashboard.ordersChart?.[chartPeriod]?.length ? (
                      <div style={{ width: "100%", height: 250 }}>
                        <ResponsiveContainer>
                          <LineChart data={dashboard.ordersChart[chartPeriod]}>
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
                        No sales data available
                      </div>
                    )}
                  </div>
                </div>

                <div id="category-performance">
                  {dashboard.categoryData.length ? (
                    <div
                      className="bg-white p-4 rounded shadow-sm "
                      style={{ width: "100%", minHeight: 250 }}
                    >
                      <h3 className="font-semibold mb-6">
                        Category Performance
                      </h3>

                      <ResponsiveContainer
                        width="100%"
                        height={250}
                        style={{ outline: "none" }}
                        margin={{ top: 20, right: 20, left: 2, bottom: 20 }}
                      >
                        <BarChart
                          data={dashboard.categoryData}
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
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      No category data available
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-semibold mb-6">Recent Orders</h3>
                {dashboard.recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <span className="font-semibold">
                      No Recent Orders Found
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dashboard.recentOrders.map((o) => (
                      <div
                        key={o.order_id}
                        className="flex justify-between items-center border-b py-2"
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
                            {new Date(o.order_date).toLocaleDateString("en-GB")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Return Requests Table */}
              <div className="bg-white p-4 rounded shadow-sm">
                <h3 className="font-semibold mb-6">Return Requests</h3>
                {returnRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <span className="font-semibold">
                      No Return Requests Found
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto bg-white rounded-box shadow-sm">
                      <table className="table text-center">
                        <thead className="text-black">
                          <tr>
                            <th>Order ID</th>
                            <th>Product Name</th>
                            <th>Customer Name</th>
                            <th>Customer Phone</th>
                            <th>Reason</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedReturnRequests.map((r) => (
                            <tr key={r.id} className="border-t">
                              <td>{r.order_id}</td>
                              <td>{r.product_name}</td>
                              <td>{r.customer_name}</td>
                              <td>{r.customer_phone}</td>
                              <td>{r.reason}</td>
                              <td>
                                <div className="flex items-center gap-2 justify-center">
                                  <button
                                    onClick={() =>
                                      openImageGalleryModal(r.images)
                                    }
                                    className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900"
                                  >
                                    <Eye size={20} />
                                  </button>

                                  {r.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleReturnRequest(r.id, "approved")
                                        }
                                        className="px-3 py-2 rounded bg-green-100 hover:bg-green-600 text-green-600 hover:text-white"
                                      >
                                        <CircleCheckBig size={20} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleReturnRequest(r.id, "rejected")
                                        }
                                        className="px-3 py-2 rounded bg-red-100 hover:bg-red-600 text-red-600 hover:text-white"
                                      >
                                        <CircleX size={20} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-center mt-2">
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={returnRequestsPage}
                          totalPages={totalPages}
                          setCurrentPage={setReturnRequestsPage}
                          renderPageNumbers={renderPageNumbers}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardView;
