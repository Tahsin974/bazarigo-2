import { Bell, Home, Menu, MessageCircle, User } from "lucide-react";
import useAuth from "../../Utils/Hooks/useAuth";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HashLink } from "react-router-hash-link";
import useAxiosSecure from "../../Utils/Hooks/useAxiosSecure";
import useNotifications from "../../Utils/Hooks/useNotifications";

export default function Topbar({ setActiveTab, messages }) {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user, userLogOut } = useAuth();
  const { notifications, refetchNotifications } = useNotifications();
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASEURL;
  const logOut = async () => {
    await userLogOut();
    queryClient.setQueryData(["user"], null); // cached value instant null

    navigate("/");
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id) =>
      axiosSecure.patch(
        `/notifications/${id}/read`,
        {},
        { withCredentials: true }
      ),

    onSuccess: () => refetchNotifications(),
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;
  console.log("messages", messages);

  const unReadMessage = messages?.filter((m) => m.unread_count > 0).length || 0;
  console.log(unReadMessage);

  return (
    <div>
      <header className="bg-white shadow-sm px-4 sm:px-6 py-6 flex items-center justify-between gap-6">
        <div className=" flex items-center">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square bg-white  active:bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] active:border-[#FF0055] border-gray-300 shadow-none"
            >
              <Menu
                size={24}
                className="text-gray-800 active:text-white cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center w-full  ">
          <h1 className="md:flex hidden font-semibold me-auto text-sm sm:text-base truncate sm:w-max w-28">
            Welcome, {user?.name || user?.full_name}!
          </h1>
          <div className="flex items-center justify-end md:gap-6 gap-2 ms-auto">
            <div className="flex items-center md:gap-3">
              <button
                onClick={() => setActiveTab("Messages")}
                className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none"
              >
                <div className="indicator">
                  <MessageCircle className="h-5" />
                  {unReadMessage > 0 && (
                    <span className="indicator-item badge badge-xs bg-[#FF0055]  border-0 text-white">
                      {unReadMessage || 0}
                    </span>
                  )}
                </div>
              </button>
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  role="button"
                  className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none"
                >
                  <div className="indicator">
                    <Bell className="h-5" />
                    {unreadCount > 0 && (
                      <span className="indicator-item badge badge-xs bg-[#FF0055]  border-0 text-white">
                        {unreadCount || 0}
                      </span>
                    )}
                  </div>
                </button>
                <ul
                  tabIndex="-1"
                  className="dropdown-content bg-white text-gray-800 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto mt-3 p-1 border border-gray-200 flex flex-col"
                >
                  {/* Header with title and See All link */}
                  <li className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">
                      Notifications
                    </span>
                    <button
                      onClick={() => setActiveTab("Notifications")}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      See All
                    </button>
                  </li>

                  {/* Notifications list */}
                  {notifications?.length ? (
                    notifications.map((n) => (
                      <li
                        key={n.id}
                        onClick={() => markAsReadMutation.mutate(n.id)}
                        className={`flex flex-col px-4 py-3 cursor-pointer transition duration-200 ease-in-out rounded-md mb-1 hover:bg-gray-100 ${
                          !n.is_read ? "bg-blue-50" : ""
                        }`}
                      >
                        <span className="font-semibold text-gray-900 truncate">
                          {n.title}
                        </span>
                        <span className="text-sm text-gray-600 truncate">
                          {n.message}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 text-center text-gray-500">
                      No notifications
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="text-right">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border-gray-300 active:border-[#FF0055] hover:border-[#FF0055] shadow-none hover:shadow-none"
                >
                  <div className="w-10 rounded-full">
                    {user?.img ?? user?.profile_img ? (
                      <img
                        alt="Tailwind CSS Navbar component"
                        src={
                          user.img
                            ? `${baseUrl}${user.img}`
                            : user.profile_img
                            ? `${baseUrl}${user.profile_img}`
                            : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                      />
                    ) : (
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    )}
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-1 mt-3 w-52 p-2 shadow "
                >
                  <li>
                    <a
                      onClick={() => setActiveTab("My Account")}
                      className="justify-between text-sm"
                    >
                      Profile
                    </a>
                  </li>
                  {user.role !== "customer" && (
                    <li>
                      <HashLink
                        to={`/seller-page/${
                          user.store_name || user.full_name
                        }/store#`}
                        state={{ id: user.id }}
                        className="text-sm"
                      >
                        My Store
                      </HashLink>
                    </li>
                  )}
                  <li>
                    <a
                      className="text-sm"
                      onClick={() => setActiveTab("Settings")}
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a className="text-sm" role="button" onClick={logOut}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
