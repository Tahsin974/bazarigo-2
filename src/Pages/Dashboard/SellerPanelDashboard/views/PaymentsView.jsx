import { motion } from "framer-motion";
import SearchField from "../../../../components/ui/SearchField";
import SelectField from "../../../../components/ui/SelectField";
import Pagination from "../../../../components/ui/Pagination";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import { Banknote, CreditCard } from "lucide-react";

export default function PaymentsView({
  active,
  payments,
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
          <div className="overflow-x-auto rounded-box bg-white">
            <table className="table table-sm w-full text-center">
              <thead className=" ">
                <tr className="text-black">
                  <th>SL No.</th>
                  <th>Payment Date</th>

                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <span className="font-semibold">{payment.id}</span>
                    </td>
                    <td>
                      <span className="font-semibold">
                        {new Date(payment.payment_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </span>
                    </td>

                    <td>
                      <span className="font-semibold">
                        ৳{payment.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <div>
                          <div className="flex items-center gap-1 font-semibold">
                            <span className="font-semibold">
                              {payment.payment_method === "Mobile Banking" ? (
                                <CreditCard className="w-4 h-4 text-teal-500" />
                              ) : (
                                <Banknote className="w-4 h-4 text-amber-500" />
                              )}
                            </span>
                            <span className="font-semibold">
                              {payment.payment_method}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-left">
                            <span className="font-semibold">
                              TXN: {payment.transaction_id}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {payment.payment_method === "Mobile Banking" ? (
                        <div className="bg-teal-50 p-2 rounded-lg border border-teal-200">
                          <p className=" text-teal-800">
                            <span className="font-semibold">
                              Mobile Number:
                            </span>
                          </p>
                          <p className="text-teal-700 font-semibold">
                            <span className="font-semibold">
                              {payment.mobile_bank_account_number}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <p className="font-semibold text-amber-800">
                            <span className="font-semibold">
                              Bank Name: {payment.bank_name}
                            </span>
                          </p>
                          <p className="text-amber-700 text-xs">
                            <span className="font-semibold">
                              A/C Holder: {payment.bank_account_holder_name}
                            </span>
                          </p>
                          <p className="text-amber-700 text-xs">
                            <span className="font-semibold">
                              A/C No: {payment.bank_account_number}
                            </span>
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No payment records found
              </div>
            )}
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
