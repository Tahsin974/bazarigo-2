import axios from "axios";
import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
import FormattedDate from "../../../../Utils/Hooks/FormattedDate";
import { useRenderPageNumbers } from "../../../../Utils/Hooks/useRenderPageNumbers";

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
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / paymentPageSize)
  );

  const handleApprove = async (id) => {
    const res = await axios.patch(`http://localhost:3000/payments/${id}`, {
      status: "Approved",
    });
    if (res.data.updatedCount > 0) {
      return refetch();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row   sm:items-center sm:justify-between gap-4 mb-3">
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
      </div>

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
            {paginatedPayments
              .sort((a, b) => {
                if (a.status === "pending" && b.status !== "pending") return -1;
                if (a.status !== "pending" && b.status === "pending") return 1;
                return 0;
              })
              .map((p) => (
                <tr key={p.id} className="border-b">
                  <td>{p.transactionid}</td>
                  <td>{FormattedDate(p.payment_date)}</td>
                  <td>৳{p.amount}</td>
                  <td>{p.payment_method}</td>
                  <td>{p.phone_number ? p.phone_number : "N/A"}</td>
                  <td>
                    {p.status === "pending" ? (
                      <button
                        onClick={() => handleApprove(p.transactionid)}
                        className="px-3 py-1  rounded bg-[#00C853] hover:bg-[#00B34A] text-white"
                      >
                        Approve
                      </button>
                    ) : (
                      <p className="text-green-400">Approved</p>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={paymentPage}
        totalPages={totalPages}
        setCurrentPage={setPaymentPage}
        renderPageNumbers={useRenderPageNumbers(
          paymentPage,
          totalPages,
          setPaymentPage
        )}
      />
    </div>
  );
}

export default PaymentsView;
