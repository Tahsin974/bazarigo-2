import { Home, Menu, User } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

export default function Drawer({
  user,
  activeTab,
  setActiveTab,
  products = [],
  orders = [],
  customers = [],
  sellers = [],
  payments = [],
  promotions = [],
  notifications = [],
  cart = [],
  items,
  children,
}) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}

        <Topbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          cart={cart}
        />
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          notifications={notifications}
          orders={orders}
          cart={cart}
          products={products}
          customers={customers}
          sellers={sellers}
          payments={payments}
          promotions={promotions}
          items={items}
        />
      </div>
    </div>
  );
}

/* 
<aside className=" bg-white min-h-full w-80 ">
         
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
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Home size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <Package size={18} /> Orders
            </button>
            <button
              onClick={() => setActiveTab("cart")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "cart"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <ShoppingBag size={18} /> Cart
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "payments"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <CreditCard size={18} /> Payments
            </button>
            <button
              onClick={() => setActiveTab("returns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "returns"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <RotateCcw size={18} /> Returns
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "addresses"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <MapPin size={18} /> Addresses
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === "notifications"
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
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
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
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
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
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
              className="block w-full text-center px-4 py-2 rounded-md bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white hover:bg-[#e6004d]"
            >
              Go to Home Page
            </a>
          </div>
        </aside> */
