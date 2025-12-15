import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import FormattedDate from "../../../../Utils/Helpers/FormattedDate";
import useAxiosPublic from "../../../../Utils/Hooks/useAxiosPublic";
import { useRenderPageNumbers } from "../../../../Utils/Helpers/useRenderPageNumbers";
import { Banknote, CreditCard } from "lucide-react";

function PaymentsView({
  payments,
  paymentPage,
  setPaymentPage,
  paymentSearch,
  setPaymentSearch,
  paymentPageSize = 10,
  filteredPayments,
  paginatedPayments,
  refetch,
  sellerPayments,
  sellerPaymentsPage,
  setSellerPaymentsPage,
  sellerPaymentsSearch,
  setSellerPaymentsSearch,
  filteredSellerPayments,
  paginatedSellerPayments,
}) {
  const axiosPublic = useAxiosPublic();
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / paymentPageSize)
  );
  const sellerPaymentsTotalPages = Math.max(
    1,
    Math.ceil(filteredSellerPayments.length / paymentPageSize)
  );

  const handleApprove = async (id, orderId) => {
    const res = await axiosPublic.patch(`/payments/${id}`, {
      status: "Approved",
      orderId,
    });
    if (res.data.updatedCount > 0) {
      return refetch();
    }
  };
  const renderPageNumbers = useRenderPageNumbers(
    paymentPage,
    totalPages,
    setPaymentPage
  );
  const renderPageNumbersForSellerPayments = useRenderPageNumbers(
    sellerPaymentsPage,
    sellerPaymentsTotalPages,
    setSellerPaymentsPage
  );

  return (
    <div className="space-y-10">
      <section className="flex flex-col sm:flex-row   sm:items-center sm:justify-between gap-4 mb-3">
        {/* Left: Title (and mobile button if needed) */}
        <div className="flex items-center justify-center w-full md:w-auto order-1">
          <h3 className="font-semibold sm:text-md text-[15px]">
            Payments ({payments.length})
          </h3>
        </div>

        {/* Middle: Search field */}
        <div className="order-2 w-full md:flex-1 md:flex md:justify-end">
          <SearchField
            placeholder="Search payments..."
            searchValue={paymentSearch}
            searchValueChange={(e) => {
              setPaymentSearch(e.target.value);
              setPaymentPage(1);
            }}
          />
        </div>
      </section>
      {paginatedPayments.length ? (
        <>
          <div className="overflow-x-auto bg-white rounded-box">
            <table className="table text-center">
              <thead className="bg-gray-50">
                <tr className="text-black">
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
                  <tr key={p.id} className="border-b">
                    <td>
                      <span className="font-semibold">{p.id}</span>
                    </td>
                    <td>
                      <span className="font-semibold">
                        {new Date(p.payment_date).toLocaleDateString("en-CA", {
                          timeZone: "Asia/Dhaka",
                        })}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">
                        ৳{p.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">{p.payment_method}</span>
                    </td>
                    <td>
                      <span className="font-semibold">
                        {p.phone_number ? p.phone_number : "N/A"}
                      </span>
                    </td>
                    <td>
                      {p.status === "pending" ? (
                        <button
                          onClick={() => handleApprove(p.id, p.order_id)}
                          className="px-3 py-1  rounded bg-[#00C853] hover:bg-[#00B34A] text-white"
                        >
                          Approve
                        </button>
                      ) : (
                        <span className="text-green-400 font-semibold">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={paymentPage}
              totalPages={totalPages}
              setCurrentPage={setPaymentPage}
              renderPageNumbers={renderPageNumbers}
            />
          )}
        </>
      ) : (
        <div>
          <div className="mt-3 flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
            <span className="font-semibold"> No payment records found</span>
          </div>
        </div>
      )}
      <section className="flex flex-col sm:flex-row   sm:items-center sm:justify-between gap-4 mb-3">
        {/* Left: Title (and mobile button if needed) */}
        <div className="flex items-center justify-center w-full md:w-auto order-1">
          <h3 className="font-semibold sm:text-md text-[15px]">
            Seller Payments ({sellerPayments.length})
          </h3>
        </div>

        {/* Middle: Search field */}
        <div className="order-2 w-full md:flex-1 md:flex md:justify-end">
          <SearchField
            placeholder="Search payments..."
            searchValue={sellerPaymentsSearch}
            searchValueChange={(e) => {
              setSellerPaymentsSearch(e.target.value);
              setSellerPaymentsPage(1);
            }}
          />
        </div>
      </section>

      {paginatedSellerPayments.length ? (
        <>
          <div className="overflow-x-auto rounded-box bg-white">
            <table className="table table-sm w-full text-center">
              <thead className=" ">
                <tr className="text-black">
                  <th>Payment ID</th>
                  <th>Payment Date</th>
                  <th>Seller Name</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSellerPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>
                      {new Date(payment.payment_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>
                      <div className="font-medium">{payment.seller_name}</div>
                      <div className="text-sm text-gray-500">
                        ({payment.seller_store_name})
                      </div>
                    </td>
                    <td className="text-indigo-600 font-semibold">
                      ৳{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <div>
                          <div className="flex items-center gap-1 font-semibold">
                            <span>
                              {payment.payment_method === "Mobile Banking" ? (
                                <CreditCard className="w-4 h-4 text-teal-500" />
                              ) : (
                                <Banknote className="w-4 h-4 text-amber-500" />
                              )}
                            </span>
                            <span>{payment.payment_method}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 text-left">
                            TXN: {payment.transaction_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {payment.payment_method === "Mobile Banking" ? (
                        <div className="bg-teal-50 p-2 rounded-lg border border-teal-200">
                          <p className="font-semibold text-teal-800">
                            Mobile Number:
                          </p>
                          <p className="text-teal-700">
                            {payment.mobile_bank_account_number}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <p className="font-semibold text-amber-800">
                            Bank Name: {payment.bank_name}
                          </p>
                          <p className="text-amber-700 text-xs">
                            A/C Holder: {payment.bank_account_holder_name}
                          </p>
                          <p className="text-amber-700 text-xs">
                            A/C No: {payment.bank_account_number}
                          </p>
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`font-semibold ${
                          payment.status === "pending"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sellerPayments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No payment records found
              </div>
            )}
          </div>
          {sellerPaymentsTotalPages > 1 && (
            <Pagination
              currentPage={sellerPaymentsPage}
              totalPages={sellerPaymentsTotalPages}
              setCurrentPage={setSellerPaymentsPage}
              renderPageNumbers={renderPageNumbersForSellerPayments}
            />
          )}
        </>
      ) : (
        <div>
          <div className="mt-3 flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
            <span className="font-semibold"> No payment records found</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsView;
