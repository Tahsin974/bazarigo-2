import { CheckCircle, Clock, Hash } from "lucide-react";

export default function OrderDetailsSection({
  PRIMARY_COLOR,
  id,
  date,
  paymentMethod,
  payment_status,
}) {
  const orderDate = new Date(date);
  const formatted = orderDate.toLocaleDateString("en-GB");
  const renderStatusBadge = (status) => {
    let colorClass = "";
    let icon = null;
    let text = "";

    switch (status) {
      case "Approved":
        colorClass = "bg-green-200 text-green-800 border-green-400";
        icon = <CheckCircle size={16} />;
        text = "Paid";
        break; // ✅ break দিতে হবে

      case "Pending":
      default:
        colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
        icon = <Clock size={16} />;
        text = "Pending";
        break;
    }

    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold border ${colorClass}`}
      >
        {icon}
        {text}
      </span>
    );
  };
  return (
    <div>
      <div className="bg-white sm:p-6 p-4 rounded-2xl shadow-lg border border-gray-200">
        <h3
          className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center sm:justify-start"
          style={{ color: PRIMARY_COLOR }}
        >
          <Hash size={20} className="mr-2" /> Order Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4  text-sm ">
          <div className="flex flex-row items-center justify-between md:flex-col gap-1">
            <h3 className="text-gray-500 text-sm sm:text-base">Order ID</h3>
            <span className="font-bold text-gray-800 text-sm sm:text-base">
              {id}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between md:flex-col gap-1">
            <h3 className="text-gray-500 text-sm sm:text-base">Date</h3>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {formatted}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between md:flex-col gap-1">
            <h3 className="text-gray-500 text-sm sm:text-base">
              Payment Method
            </h3>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {paymentMethod}
            </span>
          </div>
          <div className="flex flex-row items-center justify-between md:flex-col gap-1">
            <h3 className="text-gray-500 text-sm sm:text-base">
              Payment Status
            </h3>
            {renderStatusBadge(payment_status)}
          </div>
        </div>
      </div>
    </div>
  );
}
