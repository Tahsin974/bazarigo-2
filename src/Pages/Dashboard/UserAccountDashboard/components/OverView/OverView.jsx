export default function Overview({
  orders,
  cart,
  unreadCount,
  activeTab,
  cartTotal,
}) {
  return (
    <div>
      {activeTab === "Overview" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="font-semibold">Orders Summary</h4>
            <p className="text-sm text-gray-500">
              You have {orders.length} recent orders
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="font-semibold">Active Cart</h4>
            <p className="text-sm text-gray-500">
              {cart.length} items — ৳{cartTotal}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          </div>
        </div>
      )}
    </div>
  );
}
