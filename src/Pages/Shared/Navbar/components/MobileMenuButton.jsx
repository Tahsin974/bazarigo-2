import { Menu, X } from "lucide-react";

export default function MobileMenuButton({ isMenuOpen, toggleMenu }) {
  return (
    <div className="md:hidden flex items-center">
      <button onClick={toggleMenu} aria-label="Toggle mobile menu">
        {isMenuOpen ? (
          <X size={24} className="text-gray-800" />
        ) : (
          <Menu size={24} className="text-gray-800" />
        )}
      </button>
    </div>
  );
}
