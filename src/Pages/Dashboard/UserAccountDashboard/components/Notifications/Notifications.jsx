export default function Notifications({
  notifications,
  activeTab,
  setActiveTab,
  markNotificationRead,
}) {
  return (
    <div>
      {activeTab === "Notifications" && (
        <div className="bg-white sm:p-6 p-3 rounded-2xl shadow-md space-y-4 max-w-2xl">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {["all", "orders", "payments", "promotions"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveTab("notifications") || setActiveTab(cat)
                }
                className={`px-3 py-1 rounded-md border  text-sm capitalize ${
                  cat === "all"
                    ? "bg-[#FF0055] border-[#FF0055] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`border rounded-lg p-3 flex flex-wrap gap-3 items-center justify-between ${
                  n.read ? "opacity-70" : ""
                }`}
              >
                <div>
                  <div className="font-medium">
                    [{n.category}] {n.message}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
