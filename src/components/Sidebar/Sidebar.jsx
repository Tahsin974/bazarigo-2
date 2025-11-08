import logo from "@/assets/Bazarigo.svg";
import { LogOut, X } from "lucide-react";
export default function Sidebar({
  active,
  setActive,
  products = [],
  orders = [],
  customers = [],
  sellers = [],
  payments = [],
  promotions = [],
  notifications = [],
  wishlist = [],
  cart = [],
  items = [],
  handleMenu,
}) {
  const getCount = (item, stores) => {
    switch (item) {
      case "Products":
        return stores.products.length === 0 ? "" : stores.products.length;
      case "Orders":
        return stores.orders.length === 0 ? "" : stores.orders.length;
      case "Customers":
        return stores.customers.length === 0 ? "" : stores.customers.length;
      case "Sellers":
        return stores.sellers.length === 0 ? "" : stores.sellers.length;
      case "Payments":
        return stores.payments.length === 0 ? "" : stores.payments.length;
      case "Promotions":
        return stores.promotions.length === 0 ? "" : stores.promotions.length;
      case "Notifications":
        return stores.notifications.length === 0
          ? ""
          : stores.notifications.length;
      case "Cart":
        return stores.cart.length === 0 ? "" : stores.cart.length;
      case "Wishlist":
        return stores.wishlist.length === 0 ? "" : stores.wishlist.length;

      default:
        return "";
    }
  };

  return (
    <div>
      <aside className="w-80 md:w-64 bg-white border-r shadow-sm min-h-screen">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <a href="/#" aria-label="E-commerce Home">
              <img src={logo} className="h-10 w-auto" alt="logo" />
            </a>
          </div>
          <button
            onClick={handleMenu}
            className="btn bg-transparent border-transparent text-[#1D2345] btn-ghost ms-auto text-2xl font-bold cursor-pointer shadow-none lg:hidden"
          >
            <X />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between ${
                active === item
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "text-gray-700"
              }`}
            >
              <span className="font-medium">{item}</span>
              <span
                className={`text-xs text-gray-400 ${
                  active === item ? "text-white" : "text-gray-400"
                }`}
              >
                {getCount(item, {
                  products,
                  orders,
                  customers,
                  sellers,
                  payments,
                  promotions,
                  notifications,
                  cart,
                  wishlist,
                })}
              </span>
            </button>
          ))}
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
            className="block w-full text-center px-4 py-2 rounded-md bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
          >
            Go to Home Page
          </a>
        </div>
      </aside>
    </div>
  );
}
