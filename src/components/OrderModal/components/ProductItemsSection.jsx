import { DollarSign } from "lucide-react";

export default function ProductItemsSection({ items, PRIMARY_COLOR }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl border overflow-x-auto"
      style={{ borderColor: PRIMARY_COLOR }}
    >
      <h3
        className="text-xl font-bold p-6 text-gray-800 flex items-center border-b border-gray-200"
        style={{ color: PRIMARY_COLOR }}
      >
        <DollarSign size={20} className="mr-2" /> Product Details
      </h3>
      <div className="overflow-x-auto bg-white rounded-box  ">
        <table className="table  text-center">
          {/* head */}
          <thead className="text-black">
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t">
                <td>{item.product_id} </td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
