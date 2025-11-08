import { House, ShoppingCart, User } from "lucide-react";
import { HashLink } from "react-router-hash-link";

export default function DesktopIcons() {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <HashLink
        title="Home"
        to="/#"
        aria-label="Shopping Cart"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <House size={20} />
      </HashLink>

      <HashLink
        title="Cart"
        to="/cart#"
        aria-label="Shopping Cart"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <ShoppingCart size={20} />
      </HashLink>

      <HashLink
        title="User"
        to="/dashboard#"
        aria-label="User Account"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <User size={20} />
      </HashLink>
      <a href="/seller-registration#" target="_blank">
        <button className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
          Become a Seller
        </button>
      </a>
    </div>
  );
}
