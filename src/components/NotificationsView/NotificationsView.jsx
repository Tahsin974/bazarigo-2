import { useEffect, useState } from "react";
import useNotifications from "../../Utils/Hooks/useNotifications";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../Utils/Hooks/useAxiosSecure";

export default function NotificationsView({ activeTab }) {
  const { notifications, refetchNotifications } = useNotifications();
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("All");
  const filteredNotifications =
    filter === "Unread"
      ? notifications?.filter((n) => !n.is_read) // assuming `read` boolean
      : notifications;
  const markAsReadMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(
        `/notifications/${id}/read`,
        {},
        { withCredentials: true }
      ),
    onSuccess: () => refetchNotifications(),
  });

  // 🔹 tab open হলেই unread গুলো read করে দেবে
  useEffect(() => {
    if (activeTab === "Notifications" && notifications?.length) {
      const unread = notifications.filter((n) => !n.is_read);

      unread.forEach((n) => {
        markAsReadMutation.mutate(n.id);
      });
    }
  }, [activeTab, notifications]);

  return (
    <div>
      {activeTab === "Notifications" && (
        <div className=" sm:p-6 p-4 rounded-2xl space-y-4 w-full  ">
          {/* Filter Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setFilter("All")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                filter === "All"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Unread")}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                filter === "Unread"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Notifications List */}
          <div className="mx-auto space-y-3 container">
            {filteredNotifications?.length ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col p-4 rounded-xl    bg-white transition-shadow duration-300"
                >
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mb-2 md:text-lg">
                    {notification.message}
                  </p>
                  <span className="text-xs text-gray-400 self-end">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 text-center md:py-10 py-6 text-gray-500 italic">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
