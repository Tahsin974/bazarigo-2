import { Calendar, CheckCircle, Hash, MapPin } from "lucide-react";

export default function OrderDetailsSection({
  PRIMARY_COLOR,
  id,
  date,
  paymentMethod,
  payment_status,
}) {
  const renderStatusBadge = (status) => {
    let colorClass = "";
    let icon = null;
    let text = "";

    switch (status) {
      case "approved":
        colorClass = "bg-green-100 text-green-700 border-green-300";
        icon = <CheckCircle size={16} />;
        text = "Approved";
        break;

      case "pending":
      default:
        colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";
        icon = <Calendar size={16} />;
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
    <div c>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h3
          className="text-xl font-bold text-gray-800 mb-4 flex items-center"
          style={{ color: PRIMARY_COLOR }}
        >
          <Hash size={20} className="mr-2" /> Order Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col">
            <h3 className="text-gray-500">Order ID</h3>
            <span className="font-bold text-gray-800 text-base">{id}</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-gray-500">Date</h3>
            <span className="font-semibold text-gray-800 text-base">
              {date}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-gray-500">Payment Method</h3>
            <span className="font-semibold text-gray-800 text-base">
              {paymentMethod}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-gray-500">Status</h3>
            {renderStatusBadge(payment_status)}
          </div>
        </div>
      </div>
    </div>
  );
}
