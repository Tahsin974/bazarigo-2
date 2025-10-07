import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import ExportBtn from "../../../../components/ui/ExportBtn";

export default function PaymentsView({
  active,
  paymentSearch,
  setPaymentSearch,
  paymentSort,
  setPaymentSort,
  paymentPage,
  setPaymentPage,
  paymentPageSize = 10,
  paginatedPayments,
  filteredPayments,
  exportPaymentsExcel,
}) {
  return (
    <div>
      {active === "Payments" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <SearchField
              searchValue={paymentSearch}
              searchValueChange={(e) => {
                setPaymentSearch(e.target.value);
                setPaymentPage(1);
              }}
              placeholder="Search by method or status..."
            />
            <SelectField
              selectValue={paymentSort}
              selectValueChange={(e) => setPaymentSort(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </SelectField>

            <div className="flex gap-2">
              <ExportBtn exportBtnHandler={exportPaymentsExcel} />
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Payment ID</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.date}</td>
                    <td className="px-4 py-2">${p.amount}</td>
                    <td className="px-4 py-2">{p.method}</td>
                    <td className="px-4 py-2">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {Array.from(
              {
                length: Math.max(
                  1,
                  Math.ceil(filteredPayments.length / paymentPageSize)
                ),
              },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setPaymentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    paymentPage === i + 1
                      ? "bg-[#FF0055] text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
