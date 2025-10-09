import { Home, Menu, User } from "lucide-react";

export default function Topbar({
  user,
  setActiveTab,
  activeTab,
  notifications,
  cart,
}) {
  return (
    <div>
      <header className="bg-white shadow-sm p-6 flex items-center justify-between gap-6">
        <div className=" flex items-center">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square bg-white  active:bg-gradient-to-r from-[#FF7B7B] to-[#FF0055] active:border-[#FF0055] border-gray-300 shadow-none"
            >
              <Menu
                size={24}
                className="text-gray-800 active:text-white cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center w-full  gap-6">
          <h1 className="font-semibold me-auto text-sm sm:text-base ">
            Welcome, {user.name}!
          </h1>
          <a
            href="/"
            className=" items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-[#FF0055] border border-red-100 hidden sm:flex"
          >
            <Home size={16} /> Home
          </a>

          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setActiveTab("My Account")}
              className={`text-sm font-medium flex items-center gap-2 cursor-pointer ${
                activeTab === "My Account" ? "text-[#FF0055]" : "text-gray-700"
              }`}
            >
              <span>
                <User size={16} />
              </span>{" "}
              <span>My Account</span>
            </button>
            {!notifications ||
              (!cart && (
                <>
                  <button
                    onClick={() => setActiveTab("Notifications")}
                    className={`text-sm font-medium flex items-center  cursor-pointer ${
                      activeTab === "Notifications"
                        ? "text-[#FF0055]"
                        : "text-gray-700"
                    }`}
                  >
                    <span>Notifications</span>{" "}
                    {notifications.length > 0 && (
                      <span className="ml-1 text-xs bg-red-100 text-red-700 px-1 rounded">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("Cart")}
                    className={`text-sm font-medium flex items-center gap-2 cursor-pointer ${
                      activeTab === "Cart" ? "text-[#FF0055]" : "text-gray-700"
                    }`}
                  >
                    <span>Cart</span> <span>({cart.length})</span>
                  </button>
                </>
              ))}
          </div>

          <div className="text-right">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
