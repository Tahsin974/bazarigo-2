import { DollarSign } from "lucide-react";

export default function BillingSummaryCardSection({
  PRIMARY_COLOR,
  subtotal,
  delivery_charge,
  total,
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl border overflow-x-auto space-y-4 p-6"
      style={{ borderColor: PRIMARY_COLOR }}
    >
      <h3
        className="text-xl font-bold  text-gray-800 flex items-center border-b border-gray-200"
        style={{ color: PRIMARY_COLOR }}
      >
        <DollarSign size={20} className="mr-2" /> Billing Summary
      </h3>
      <div>
        <div className="flex justify-between py-3 text-gray-700 border-b">
          <span className="text-lg font-bold">Subtotal (Items)</span>
          <span className="text-lg font-bold">
            ৳{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between py-3 text-gray-700 border-b border-dashed">
          <span className="text-lg font-bold">Delivery Charge</span>
          <span className="text-lg font-bold">
            ৳{delivery_charge.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between py-3 text-gray-700 ">
          <h3 className="text-2xl font-bold">Total</h3>
          <h3 className="text-2xl font-bold">
            ৳{total.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>
    </div>
  );
}
