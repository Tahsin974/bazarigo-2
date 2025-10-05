import {
  Bell,
  CreditCard,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  RotateCcw,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import logo from "../../assets/Bazarigo.svg";

export default function Drawer({
  user,
  cart,
  unreadCount,
  activeTab,
  setActiveTab,

  children,
}) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}

        <header className="bg-white shadow-sm px-6 py-6 flex items-center justify-between gap-6">
          <div className=" flex items-center">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square bg-white  active:bg-[#FF0055] active:border-[#FF0055] border-gray-300 shadow-none"
              >
                <Menu
                  size={24}
                  className="text-gray-800 active:text-white cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center ms-auto gap-6">
            <a
              href="/"
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-[#FF0055] border border-red-100"
            >
              <Home size={16} /> Home
            </a>

            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => setActiveTab("account")}
                className={`text-sm font-medium flex items-center gap-2 cursor-pointer ${
                  activeTab === "account" ? "text-[#FF0055]" : "text-gray-700"
                }`}
              >
                <span>
                  <User size={16} />
                </span>{" "}
                <span>My Account</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`text-sm font-medium flex items-center  cursor-pointer ${
                  activeTab === "notifications"
                    ? "text-[#FF0055]"
                    : "text-gray-700"
                }`}
              >
                <span>Notifications</span>{" "}
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-red-100 text-red-700 px-1 rounded">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                className={`text-sm font-medium flex items-center gap-2 cursor-pointer ${
                  activeTab === "cart" ? "text-[#FF0055]" : "text-gray-700"
                }`}
              >
                <span>Cart</span> <span>({cart.length})</span>
              </button>
            </div>

            <div className="text-right">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        </header>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <aside className="menu bg-white min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <div className="px-6 py-3  border-b border-gray-300">
            <div>
              <a href="/#" aria-label="E-commerce Home">
                <img src={logo} className="h-10 w-auto" alt="logo" />
              </a>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Welcome, {user.name}
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "overview"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Home size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "orders"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Package size={18} /> Orders
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "cart"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <ShoppingBag size={18} /> Cart
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "payments"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <CreditCard size={18} /> Payments
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "returns"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <RotateCcw size={18} /> Returns
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "addresses"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <MapPin size={18} /> Addresses
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "notifications"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Bell size={18} /> Notifications{" "}
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                {unreadCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "account"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>
                <User size={18} />
              </span>{" "}
              <span>My Account</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "settings"
                  ? "bg-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Settings size={18} /> Settings
            </button>
          </nav>

          <div className="p-4 border-t border-gray-300 space-y-2">
            <button
              onClick={() => alert("Logging out (demo)")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              <LogOut size={18} /> Log out
            </button>
            <a
              href="/"
              className="block w-full text-center px-4 py-2 rounded-md bg-[#FF0055] text-white hover:bg-[#e6004d]"
            >
              Go to Home Page
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
