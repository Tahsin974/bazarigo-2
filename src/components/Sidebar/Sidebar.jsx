import logo from "@/assets/Bazarigo.svg";
export default function Sidebar({
  active,
  setActive,
  products,
  orders,
  customers,
  sellers,
  payments,
  promotions,
  items = [],
}) {
  const getCount = (item, stores) => {
    switch (item) {
      case "Products":
        return stores.products.length;
      case "Orders":
        return stores.orders.length;
      case "Customers":
        return stores.customers.length;
      case "Sellers":
        return stores.sellers.length;
      case "Payments":
        return stores.payments.length;
      case "Promotions":
        return stores.promotions.length;
      default:
        return "";
    }
  };
  return (
    <div>
      <aside className="w-full md:w-64 bg-white border-r shadow-sm ">
        <div className="p-4 border-b">
          <div>
            <a href="/#" aria-label="E-commerce Home">
              <img src={logo} className="h-10 w-auto" alt="logo" />
            </a>
          </div>
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
              <span className="text-xs text-gray-400">
                {getCount(item, {
                  products,
                  orders,
                  customers,
                  sellers,
                  payments,
                  promotions,
                })}
              </span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
}
