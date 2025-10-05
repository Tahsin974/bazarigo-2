import React from "react";

function PaymentsView({ payments }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Payments</h3>
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
            {payments.map((p) => (
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
    </div>
  );
}

export default PaymentsView;
