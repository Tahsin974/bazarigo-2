import { Menu, X } from "lucide-react";

export default function MobileMenuButton({ isMenuOpen, toggleMenu }) {
  return (
    <div className="md:hidden flex items-center">
      <button
        className="cursor-pointer"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {isMenuOpen ? (
          <X
            size={24}
            className="text-gray-800 transition-transform duration-500 ease-in-out rotate-90"
          />
        ) : (
          <Menu
            size={24}
            className="text-gray-800 transition-transform duration-500 ease-in-out"
          />
        )}
      </button>
    </div>
  );
}
