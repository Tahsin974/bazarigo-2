import React from "react";

function CustomersView({ customers, selected, toggleSelect, onAdd }) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Customers ({customers.length})</h3>
        <button
          onClick={onAdd}
          className="px-3 py-1 rounded bg-[#FF0055] text-white cursor-pointer "
        >
          Add Customer
        </button>
      </div>
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2"></th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id)}
                    onChange={() => toggleSelect(c.id)}
                  />
                </td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersView;
