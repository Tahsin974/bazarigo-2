import { useEffect, useState } from "react";
import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import DesktopIcons from "./components/DesktopIcons";
import MobileMenuButton from "./components/MobileMenuButton";
import MobileMenu from "./components/MobileMenu";
import MobileOverlay from "./components/MobileOverlay";
import { useLocation } from "react-router";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md font-sans">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 mx-8 relative">
          <SearchBar />
        </div>

        {/* Desktop Icons */}
        <DesktopIcons />

        {/* Mobile Menu Button */}
        <MobileMenuButton
          isMenuOpen={isMenuOpen}
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Background Overlay */}
      {/* <MobileOverlay
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      /> */}

      {/* Mobile Navigation */}
      <MobileMenu isMenuOpen={isMenuOpen} />
    </nav>
  );
}
