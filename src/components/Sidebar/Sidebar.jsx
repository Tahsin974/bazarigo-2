import logo from "@/assets/Bazarigo.svg";
import { X } from "lucide-react";
export default function Sidebar({ active, setActive, items = [], handleMenu }) {
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
          {items.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center justify-between ${
                active === label
                  ? "bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] text-white"
                  : "text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2 font-medium">
                {icon}
                {label}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-300 space-y-2">
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
