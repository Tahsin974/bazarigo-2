import { Bell, House, ShoppingCart, User } from "lucide-react";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../../../Utils/Hooks/useAuth";
import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotifications from "../../../../Utils/Hooks/useNotifications";
import useAxiosSecure from "../../../../Utils/Hooks/useAxiosSecure";
import useCart from "../../../../Utils/Hooks/useCart";

export default function DesktopIcons() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();
  const { user, userLogOut } = useAuth();
  const { notifications, refetchNotifications } = useNotifications();
  const { carts } = useCart();
  const baseUrl = import.meta.env.VITE_BASEURL;
  const logOut = async () => {
    await userLogOut();
    queryClient.setQueryData(["authenticated-user"], null); // cached value instant null

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
  const markAsReadAllMutation = useMutation({
    mutationFn: () =>
      axiosSecure.patch(
        `/notifications/read-all`,
        {},
        { withCredentials: true }
      ),

    onSuccess: () => refetchNotifications(),
  });

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div className="hidden md:flex items-center gap-3">
      {!user && (
        <>
          <HashLink
            title="Home"
            to="/"
            aria-label="Shopping Cart"
            className="text-gray-800 cursor-pointer hover:text-[#FF0055] transition-colors"
          >
            <House size={20} />
          </HashLink>
        </>
      )}

      {user?.role !== "seller" &&
        user?.role !== "admin" &&
        user?.role !== "super admin" && (
          <>
            <HashLink title="Cart" to="/cart#" aria-label="Shopping Cart">
              <button className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none hover:text-[#FF0055]">
                <div className="indicator">
                  <ShoppingCart size={20} />
                  {carts.length > 0 && (
                    <span className="indicator-item badge badge-xs bg-[#FF0055]  border-0 text-white">
                      {carts.reduce(
                        (total, cartItem) =>
                          total + (cartItem.product_count || 0),
                        0
                      )}
                    </span>
                  )}
                </div>
              </button>
            </HashLink>
          </>
        )}
      {user && user.email && (
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none hover:text-[#FF0055]"
          >
            <div className="indicator">
              <Bell size={20} />
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
              <span className="font-semibold text-gray-800">Notifications</span>
              <Link
                to={
                  user?.role === "admin" || user?.role === "super admin"
                    ? "/dashboard/admin"
                    : user?.role === "seller"
                    ? "/dashboard/seller"
                    : "/dashboard"
                }
                state={"Notifications"}
                className="text-sm text-[#FF0055] hover:underline"
              >
                See All
              </Link>
            </li>

            {/* Notifications list */}
            <>
              <button
                onClick={() => markAsReadAllMutation.mutate()}
                className="bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white px-3 py-1 rounded-full text-xs  transition-shadow my-2  self-end"
              >
                Mark as read
              </button>
              {notifications?.length ? (
                notifications.map((n) => (
                  <Link
                    to={
                      user?.role === "admin" || user?.role === "super admin"
                        ? "/dashboard/admin"
                        : user?.role === "seller"
                        ? "/dashboard/seller"
                        : "/dashboard"
                    }
                    state={"Notifications"}
                  >
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
                  </Link>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">
                  No notifications
                </li>
              )}
            </>
          </ul>
        </div>
      )}

      {!user && (
        <>
          <HashLink
            title="User"
            to="/sign-up"
            aria-label="User Account"
            className="text-gray-800 cursor-pointer hover:text-[#FF0055] transition-colors"
          >
            <User size={20} />
          </HashLink>
          <a href="/seller-registration#" target="_blank">
            <button className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
              Become a Seller
            </button>
          </a>
        </>
      )}

      {user && (
        <>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="bg-white  border-gray-300 active:border-[#FF0055] hover:border-[#FF0055] shadow-none hover:shadow-none"
            >
              <div className=" w-10 h-10 rounded-full bg-[#FFE5E5] text-[#FF0055] flex items-center justify-center overflow-hidden">
                {user?.img || user?.profile_img ? (
                  <img
                    alt={user?.name || user?.full_name || "logo"}
                    src={
                      user?.img
                        ? `${baseUrl}${user.img}`
                        : `${baseUrl}${user.profile_img}`
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={24} />
                )}
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-1 mt-3 w-52 p-2 shadow "
            >
              <li>
                <a href="/#" className="text-sm hover:text-[#FF0055] ">
                  Home
                </a>
              </li>
              {user.role && (
                <li>
                  <a
                    href={
                      user?.role === "admin" || user?.role === "super admin"
                        ? "/dashboard/admin"
                        : user?.role === "moderator"
                        ? "/dashboard/moderator"
                        : user?.role === "seller"
                        ? "/dashboard/seller"
                        : "/dashboard"
                    }
                    className="text-sm hover:text-[#FF0055]"
                  >
                    Dashboard
                  </a>
                </li>
              )}
              {user.role &&
                user?.role !== "seller" &&
                user?.role !== "admin" &&
                user?.role !== "super admin" &&
                user?.role !== "moderator" && (
                  <li>
                    <a
                      href="/seller-registration#"
                      target="_blank"
                      className="text-sm hover:text-[#FF0055]"
                    >
                      Become a Seller
                    </a>
                  </li>
                )}

              <li>
                <a onClick={logOut} className="text-sm hover:text-[#FF0055]">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
