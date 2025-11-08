import { motion } from "framer-motion";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import Pagination from "../../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

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
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / paymentPageSize)
  );

  const renderPageNumbers = useRenderPageNumbers(
    paymentPage,
    totalPages,
    setPaymentPage
  );
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
                  <th>Number</th>
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
