import { Home, Menu, User, X } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { useEffect, useRef } from "react";

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
  cart = [],
  messages = [],
  items,
  children,
}) {
  // menu close handle function
  const drawerRef = useRef(null);
  const handleMenu = () => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  };

  useEffect(() => {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  }, [activeTab]);
  return (
    <div className="drawer">
      <input
        ref={drawerRef}
        id="my-drawer-3"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}

        <Topbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cart={cart}
          messages={messages}
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
          orders={orders}
          cart={cart}
          products={products}
          customers={customers}
          sellers={sellers}
          payments={payments}
          promotions={promotions}
          items={items}
          handleMenu={handleMenu}
        />
      </div>
    </div>
  );
}
