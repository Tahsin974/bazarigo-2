import { Bell, House, LogOut, ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { HashLink } from "react-router-hash-link";
import useAuth from "../../../../Utils/Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";

import useNotifications from "../../../../Utils/Hooks/useNotifications";
import useCart from "../../../../Utils/Hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ isMenuOpen }) {
  const queryClient = useQueryClient();
  const { notifications } = useNotifications();
  const { carts } = useCart();
  const navigate = useNavigate();
  const { user, userLogOut } = useAuth();

  const logOut = async () => {
    await userLogOut();
    queryClient.setQueryData(["authenticated-user"], null); // cached value instant null

    navigate("/");
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ maxHeight: 0, opacity: 0 }}
          animate={{ maxHeight: 500, opacity: 1 }}
          exit={{ maxHeight: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="bg-white/90 backdrop-blur-md shadow-lg border border-gray-100  overflow-hidden relative z-50 "
        >
          <div className="flex flex-col px-6 py-4 space-y-4">
            {/* Search Bar (Mobile) */}
            <SearchBar className="w-full" />
            <div className="flex flex-col gap-4 pt-4 border-t">
              <div className="flex justify-around items-center">
                <HashLink
                  title="Home"
                  to="/"
                  aria-label="Shopping Cart"
                  className="text-gray-800 cursor-pointer hover:text-[#FF0055] transition-colors"
                >
                  <House size={22} />
                </HashLink>
                {user?.role !== "seller" &&
                  user?.role !== "admin" &&
                  user?.role !== "super admin" && (
                    <>
                      <HashLink
                        title="Cart"
                        to="/cart#"
                        aria-label="Shopping Cart"
                      >
                        <button className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none hover:text-[#FF0055]">
                          <div className="indicator">
                            <ShoppingCart size={22} />
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
                    <button
                      tabIndex={0}
                      role="button"
                      className="btn  btn-circle bg-white text-gray-800 border-0  shadow-none"
                    >
                      <div className="indicator">
                        <Bell size={22} />
                        {unreadCount > 0 && (
                          <span className="indicator-item badge badge-xs bg-[#FF0055]  border-0 text-white">
                            {unreadCount || 0}
                          </span>
                        )}
                      </div>
                    </button>
                  </Link>
                )}

                <HashLink
                  title="User"
                  to={
                    !user
                      ? "/sign-up"
                      : user?.role === "admin" || user?.role === "super admin"
                      ? "/dashboard/admin"
                      : user?.role === "moderator"
                      ? "/dashboard/moderator"
                      : user?.role === "seller"
                      ? "/dashboard/seller"
                      : "/dashboard"
                  }
                  aria-label="User Account"
                  className="text-gray-800 cursor-pointer hover:text-[#FF0055] transition-colors"
                >
                  <User size={22} />
                </HashLink>
                {user && (
                  <>
                    <a
                      onClick={logOut}
                      title="User"
                      aria-label="User Account"
                      className="text-gray-800 cursor-pointer hover:text-[#FF0055] transition-colors"
                    >
                      <LogOut size={22} />
                    </a>
                  </>
                )}
              </div>

              {user?.role !== "seller" &&
                user?.role !== "admin" &&
                user?.role !== "super admin" &&
                user?.role !== "moderator" && (
                  <>
                    <a href="/seller-registration#">
                      <button className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center cursor-pointer w-full">
                        Become a Seller
                      </button>
                    </a>
                  </>
                )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
