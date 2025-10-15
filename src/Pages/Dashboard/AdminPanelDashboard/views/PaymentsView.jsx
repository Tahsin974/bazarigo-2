import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";
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
}) {
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / paymentPageSize)
  );

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

      <div className="bg-white p-3 rounded shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.method}</td>
                <td className="p-2">৳{p.amount}</td>
                <td className="p-2">{p.date}</td>
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
