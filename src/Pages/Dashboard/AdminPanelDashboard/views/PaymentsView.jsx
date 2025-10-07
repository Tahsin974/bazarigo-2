import Pagination from "../../../../components/ui/Pagination";
import SearchField from "../../../../components/ui/SearchField";

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
  const renderPageNumbers = () => {
    const maxVisible = 5; // show up to 5 buttons

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
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold mb-3">Payments ({payments.length})</h3>

        <SearchField
          placeholder="Search payments..."
          searchValue={paymentSearch}
          searchValueChange={(e) => {
            setPaymentSearch(e.target.value);
            setPaymentPage(1);
          }}
        />
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
                <td className="p-2">${p.amount}</td>
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
        renderPageNumbers={renderPageNumbers}
      />
    </div>
  );
}

export default PaymentsView;
