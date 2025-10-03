import { House, ShoppingBag, ShoppingCart, User } from "lucide-react";

export default function DesktopIcons() {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <a
        title="Home"
        href="#"
        aria-label="Shopping Cart"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <House size={20} />
      </a>
      <a
        title="Cart"
        href="#"
        aria-label="Shopping Cart"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <ShoppingCart size={20} />
      </a>
      <a
        title="User"
        href="#"
        aria-label="User Account"
        className="text-gray-600 cursor-pointer hover:text-[#FF0055] transition-colors"
      >
        <User size={20} />
      </a>
      <a
        href="#"
        className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        Become a Seller
      </a>
    </div>
  );
}
