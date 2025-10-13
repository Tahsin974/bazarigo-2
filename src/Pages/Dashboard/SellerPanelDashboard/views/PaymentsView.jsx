import { motion } from "framer-motion";
import { Download, MoreHorizontal, Search } from "lucide-react";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import ExportBtn from "../../../../components/ui/ExportBtn";
import Pagination from "../../../../components/ui/Pagination";

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
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / paymentPageSize)
  );

  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons
    const totalPages = Math.max(
      1,
      Math.ceil(filteredPayments.length / paymentPageSize)
    );
    const startPage = Math.max(1, paymentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    const pages = [];

    if (startPage > 1) {
      pages.push(
        <MoreHorizontal
          key="start-ellipsis"
          className="w-5 h-5 text-gray-400"
        />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPaymentPage(i)}
          className={`px-3 py-1 w-10 h-10 flex items-center justify-center font-semibold shadow-md transition cursor-pointer rounded-md ${
            paymentPage === i
              ? "bg-[#FF0055] text-white shadow-lg border border-[#FF0055] "
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 "
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <MoreHorizontal key="end-ellipsis" className="w-5 h-5 text-gray-400" />
      );
    }

    return pages;
  };
  return (
    <div>
      {active === "Payments" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
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
          <div className="overflow-x-auto bg-white rounded-box shadow-sm ">
            <table className="table  text-center">
              {/* head */}
              <thead className="text-black">
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.date}</td>
                    <td>৳{p.amount}</td>
                    <td>{p.method}</td>
                    <td>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Pagination
              currentPage={paymentPage}
              totalPages={totalPages}
              setCurrentPage={setPaymentPage}
              renderPageNumbers={renderPageNumbers}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
