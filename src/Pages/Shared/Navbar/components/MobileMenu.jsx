import { House, ShoppingCart, User } from "lucide-react";
import SearchBar from "./SearchBar";
import { HashLink } from "react-router-hash-link";

export default function MobileMenu({ isMenuOpen }) {
  if (!isMenuOpen) return null;
  return (
    <div className="md:hidden bg-white overflow-hidden shadow-inner relative z-50">
      <div className="flex flex-col px-6 py-4 space-y-4">
        {/* Search Bar (Mobile) */}
        <SearchBar className="w-full" />
        <div className="flex flex-col gap-4 pt-4 border-t">
          <div className="flex justify-around items-center">
            <HashLink
              title="Home"
              to="/#"
              aria-label="Shopping Cart"
              className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
            >
              <House size={22} />
            </HashLink>
            <HashLink
              title="Cart"
              to="/cart#"
              aria-label="Shopping Cart"
              className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
            >
              <ShoppingCart size={22} />
            </HashLink>
            <HashLink
              title="User"
              to="/dashboard#"
              aria-label="User Account"
              className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
            >
              <User size={22} />
            </HashLink>
          </div>
          <a href="/seller-registration#">
            <button className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center cursor-pointer w-full">
              Become a Seller
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
