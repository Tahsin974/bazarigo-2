import { motion } from "framer-motion";
import OrderModalHeader from "./components/OrderModalHeader";
import OrderDetailsSection from "./components/OrderDetailsSection";
import CustomerDetailsSection from "./components/CustomerDetailsSection";
import ProductItemsSection from "./components/ProductItemsSection";
import BillingSummaryCardSection from "./components/BillingSummaryCardSection";
import { Printer } from "lucide-react";
import { useRef } from "react";
import Swal from "sweetalert2";

export default function OrderModal({
  onClose,
  order,
  refetch,
  refetchReturnOrders,
}) {
  const printRef = useRef(null);

  const PRIMARY_COLOR = "#FF0055";

  const productsWithDelivery = order?.order_items?.flatMap((item) => {
    return item.productinfo.map((prod) => ({
      ...prod,
      cart_id: item.cartid,
      delivery_time: item.deliveries.delivery_time,
      delivery_cost: order.delivery_cost,
      subtotal: order.subtotal,
    }));
  });

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;

    if (!printContent) {
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

    const printWindow = window.open("", "", "width=900,height=650");

    printWindow.document.write(`
    <html>
                <head>
                    <title>Invoice - ${order.orderId}</title>
                    <style>
                        body { 
                            font-family: 'Inter', sans-serif; 
                            padding: 20px; 
                            color: #333; 
                            margin: 0;
                        }
                        .invoice-header {
                            background-color: ${PRIMARY_COLOR};
                            color: white;
                            padding: 20px;
                            border-radius: 12px 12px 0 0;
                            margin-bottom: 20px;
                            
                           
                        }
                        .invoice-header h1 {
                            margin: 0;
                            font-size: 20px;
                            display:flex;
                            flex-direction:column;
                            gap:4;
                            color:#A9A9A9;
                            text-align:center;
                           
                            
                        }
                            .invoice{
                            color:${PRIMARY_COLOR};
                             padding-bottom:10px;
                             font-size: 25px;
                            }
                            .date{
                            text-align:center;
                            font-size: 15px;
                             color:#A9A9A9 ;}
                        .section-title {
                            color: ${PRIMARY_COLOR};
                            font-size: 20px;
                            font-weight: bold;
                            border-bottom: 2px solid ${PRIMARY_COLOR}20;
                            padding-bottom: 5px;
                            margin-top: 30px;
                            margin-bottom: 15px;
                        }
                        .info-grid {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr);
                            gap: 10px;
                            font-size: 14px;
                            margin-bottom: 20px;
                        }
                        .info-grid div {
                            display: flex;
                            flex-direction: column;
                        }
                        .info-grid span:first-child {
                            color: #888;
                        }
                        .address-box {
                            border: 1px solid ${PRIMARY_COLOR}50;
                            padding: 15px;
                            border-radius: 8px;
                            background-color: #f9f9f9;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        th, td { 
                            border: 1px solid #A9A9A9; 
                            padding: 10px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f0f0f0; 
                            text-transform: uppercase;
                            font-size: 12px;
                            font-weight: bold;
                        }
                        td:nth-child(3), td:nth-child(4), td:nth-child(5) {
                            text-align: right;
                        }
                        .summary { 
                            margin-top: 30px; 
                            padding: 20px; 
                            border: 1px solid ${PRIMARY_COLOR}50;
                            border-radius: 12px;
                            background-color: ${PRIMARY_COLOR}05;
                        }
                        .summary div { 
                            display: flex; 
                            justify-content: space-between; 
                            margin-bottom: 10px; 
                            font-size: 15px;
                        }
                        .summary .total {
                            border-top: 2px solid ${PRIMARY_COLOR};
                            padding-top: 10px;
                            font-size: 22px;
                            font-weight: bold;
                            color: ${PRIMARY_COLOR};
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <h1><span class="invoice">Invoice</span> <span>
                        #${order.order_id}
                        </span></h1>
                        <p class="date">Date: ${order.order_date}</p>
                    </div>

                    <div class="section-title">Customer Information</div>
                    <div class="info-grid">
                        <div class="address-box">
                            <strong>Contact Details</strong>
                            <p>Name: ${order.customer_name}</p>
                            <p>Phone: ${order.customer_phone}</p>
                            <p>Email: ${order.customer_email}</p>
                        </div>
                        <div class="address-box">
                            <strong>Shipping Address</strong>
                            <p>${order.customer_address.replace(
                              /,/g,
                              ",<br>"
                            )}</p>
                        </div>
                    </div>

                    <div class="section-title">Items Ordered</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                             
                                <th style="text-align:right">Quantity</th>
                                <th style="text-align:right">Unit Price</th>
                                <th style="text-align:right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsWithDelivery
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.product_name}</td>
                                    
                                    <td style="text-align:right">${
                                      item.qty
                                    }</td>
                                    <td style="text-align:right">৳${
                                      item.sale_price > 0
                                        ? item.sale_price.toLocaleString(
                                            "en-IN"
                                          )
                                        : item.regular_price.toLocaleString(
                                            "en-IN"
                                          )
                                    }</td>
                                    <td style="text-align:right">৳${(
                                      (item.sale_price > 0
                                        ? item.sale_price
                                        : item.regular_price) * item.qty
                                    ).toLocaleString("en-IN")}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>

                    <div class="summary">
                        <div><span>Subtotal</span><span>৳${productsWithDelivery
                          .reduce(
                            (sum, i) =>
                              sum +
                              (i.sale_price > 0
                                ? i.sale_price
                                : i.regular_price) *
                                i.qty,
                            0
                          )
                          .toLocaleString("en-IN")}</span></div>
                        <div><span>Delivery Charge</span><span>৳${
                          order.delivery_cost
                        }</span></div>
                        
                       
                        <div class="total"><span>Total Payable</span><span>৳${order.total.toLocaleString(
                          "en-IN"
                        )}</span></div>
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
      title: `Invoice  is being printed!`,
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        id="printArea"
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-max max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <OrderModalHeader onClose={onClose} />

        <div ref={printRef}>
          <div className="p-6">
            <OrderDetailsSection
              PRIMARY_COLOR={PRIMARY_COLOR}
              id={order.order_id}
              date={order.order_date}
              paymentMethod={order.payment_method}
              payment_status={order.payment_status}
            />
          </div>
          <div className="p-6">
            <CustomerDetailsSection
              PRIMARY_COLOR={PRIMARY_COLOR}
              phone={order.customer_phone}
              name={order.customer_name}
              email={order.customer_email}
              address={order.customer_address}
            />
          </div>
          <div className="p-6">
            <ProductItemsSection
              PRIMARY_COLOR={PRIMARY_COLOR}
              items={order.order_items}
              date={order.order_date}
              orderId={order.order_id}
              refetch={refetch}
              refetchReturnOrders={refetchReturnOrders}
              onClose={onClose}
            />
          </div>
          <div className="p-6">
            <BillingSummaryCardSection
              PRIMARY_COLOR={PRIMARY_COLOR}
              subtotal={order.subtotal}
              delivery_charge={order.delivery_cost}
              total={order.total}
            />
          </div>
        </div>

        <div className="p-6 md:p-8 border-t bg-white rounded-b-3xl flex justify-between items-center">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="sm:px-6 sm:py-3 px-3 py-2 font-semibold rounded-full shadow-md transition-all transform hover:scale-[1.03] text-gray-700 flex items-center gap-2 border border-gray-300 hover:bg-gray-100 bg-white"
          >
            <Printer size={20} />
            Print Invoice
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="sm:px-6 sm:py-3 px-3 py-2 font-semibold rounded-full shadow-lg transition-all transform hover:scale-[1.03] text-white"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
