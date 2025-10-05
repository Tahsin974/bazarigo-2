export default function Notifications({
  notifications,
  activeTab,
  setActiveTab,
  markNotificationRead,
}) {
  return (
    <div>
      {activeTab === "notifications" && (
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-2xl">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="flex gap-3 mb-4">
            {["All", "Orders", "Payments", "Promotions"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveTab("notifications") || setActiveTab(cat)
                }
                className={`px-3 py-1 rounded-md border text-sm ${
                  cat === "All"
                    ? "bg-[#FF0055] text-white"
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
                className={`border rounded-lg p-3 flex items-center justify-between ${
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
                    className="px-2 py-1 rounded-md border text-sm"
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
