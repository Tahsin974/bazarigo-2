import { useEffect, useRef, useState } from "react";
import {
  exportAsCSV,
  parseCSV,
  sampleCustomers,
  sampleOrders,
  samplePayments,
  sampleProducts,
  samplePromos,
  sampleSellers,
} from "./helpers/helpers";
import Sidebar from "./components/Sidebar/Sidebar";
import DashboardView from "./views/DashboardView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import CustomersView from "./views/CustomersView";
import SellersView from "./views/SellersView";
import PromotionsView from "./views/PromotionsView";
import PaymentsView from "./views/PaymentsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import AddModal from "./components/AddModal/AddModal";
import ProductModal from "./components/ProductModal/ProductModal";

export default function AdminPanelDashboard() {
  const [active, setActive] = useState("Dashboard");

  const [products, setProducts] = useState(sampleProducts());
  const [orders, setOrders] = useState(sampleOrders());
  const [customers, setCustomers] = useState(sampleCustomers());
  const [sellers, setSellers] = useState(sampleSellers());
  const [payments, setPayments] = useState(samplePayments());
  const [promotions, setPromotions] = useState(samplePromos());

  const [selected, setSelected] = useState([]);

  // Modal controls
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // File input ref for bulk upload
  const fileRef = useRef(null);

  useEffect(() => setSelected([]), [active]);

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const bulkDelete = () => {
    if (!selected.length) return alert("No items selected");
    if (!confirm(`Delete ${selected.length} selected items?`)) return;
    if (active === "Products")
      setProducts((p) => p.filter((x) => !selected.includes(x.id)));
    if (active === "Orders")
      setOrders((o) => o.filter((x) => !selected.includes(x.id)));
    if (active === "Customers")
      setCustomers((c) => c.filter((x) => !selected.includes(x.id)));
    if (active === "Sellers")
      setSellers((s) => s.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };
  console.log(showCustomerModal);

  const handleExport = () => {
    let rows = [];
    if (active === "Products")
      rows = products.map(({ images, extras, ...rest }) => ({
        ...rest,
        extras: JSON.stringify(extras),
        images_count: images.length,
      }));
    if (active === "Orders")
      rows = orders.map(({ items, ...rest }) => ({
        ...rest,
        items_count: items.length,
      }));
    if (active === "Customers") rows = customers;
    if (active === "Sellers") rows = sellers;
    if (active === "Payments") rows = payments;
    if (active === "Promotions") rows = promotions.map((p) => ({ ...p }));
    if (!rows.length) return alert("Nothing to export for this section");
    exportAsCSV(rows, `${active}_export`);
  };

  const selectAll = () => {
    if (active === "Products") {
      const id = products.map((p) => p.id);
      setSelected(selected.length === id.length ? [] : id);
    }
    if (active === "Orders") {
      const id = orders.map((o) => o.id);
      setSelected(selected.length === id.length ? [] : id);
    }
    if (active === "Customers") {
      const id = customers.map((c) => c.id);
      setSelected(selected.length === id.length ? [] : id);
    }
    if (active === "Sellers") {
      const id = sellers.map((s) => s.id);
      setSelected(selected.length === id.length ? [] : id);
    }
  };

  const handleBulkUpload = async (file) => {
    if (!file) return;
    try {
      const rows = await parseCSV(file);
      if (!rows.length) return alert("No rows found in CSV");
      const newProducts = rows.map((r, idx) => ({
        id: `p_${Date.now()}_${idx}`,
        name: r.name || "Untitled",
        price: r.price || "0",
        category: r.category || "Uncategorized",
        description: r.description || "",
        stock: Number(r.stock || 0),
        images: [],
        extras: {},
      }));
      setProducts((p) => [...newProducts, ...p]);
      alert(`${newProducts.length} products uploaded`);
    } catch (e) {
      console.error(e);
      alert("Failed to parse CSV");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct({
      id: null,
      name: "",
      price: "",
      category: "Fashion",
      description: "",
      stock: 0,
      images: [],
      extras: {},
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (p) => {
    setEditingProduct({ ...p });
    setProductModalOpen(true);
  };

  const saveProduct = (product) => {
    if (!product.name) return alert("Product name required");
    if (product.id)
      setProducts((ps) => ps.map((x) => (x.id === product.id ? product : x)));
    else {
      product.id = `p_${Date.now()}`;
      setProducts((ps) => [product, ...ps]);
    }
    setProductModalOpen(false);
  };

  const addCustomer = (data) =>
    setCustomers((c) => [{ id: `c_${Date.now()}`, ...data }, ...c]);
  const addSeller = (data) =>
    setSellers((s) => [{ id: `s_${Date.now()}`, ...data }, ...s]);
  const addPromo = (data) =>
    setPromotions((p) => [
      { id: `promo_${Date.now()}`, active: true, ...data },
      ...p,
    ]);

  const returnOrders = orders.filter((o) => o.status === "returned");
  const normalOrders = orders.filter((o) => o.status !== "returned");
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex flex-col md:flex-row">
        <Sidebar
          active={active}
          setActive={setActive}
          products={products}
          orders={orders}
          customers={customers}
          sellers={sellers}
          payments={payments}
          promotions={promotions}
        />
        <div className="flex-1 p-6">
          <main>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{active}</h1>
              <div className="flex items-center gap-3">
                {active !== "Dashboard" && (
                  <>
                    {active === "Products" && (
                      <>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files &&
                            handleBulkUpload(e.target.files[0])
                          }
                        />
                        <button
                          onClick={() =>
                            fileRef.current && fileRef.current.click()
                          }
                          className="px-3 py-2 rounded-md border bg-[#00C853] hover:bg-[#00B34A] text-white"
                        >
                          Bulk Upload
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleExport}
                      className="px-3 py-2 rounded-md bg-[#F59E0B] hover:bg-[#D97706] text-white"
                    >
                      Export
                    </button>
                  </>
                )}

                <div className="bg-white px-3 py-2 rounded-md">Admin</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              {active === "Dashboard" && (
                <DashboardView
                  products={products}
                  orders={orders}
                  payments={payments}
                />
              )}

              {active === "Products" && (
                <ProductsView
                  products={products}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  openNewProductModal={openNewProductModal}
                  openEditProductModal={openEditProductModal}
                  setProducts={setProducts}
                  allSelected={
                    selected.length === products.length && products.length > 0
                  }
                  toggleSelectAll={selectAll}
                  bulkDelete={bulkDelete}
                />
              )}

              {active === "Orders" && (
                <OrdersView
                  orders={normalOrders}
                  returns={returnOrders}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  setOrders={setOrders}
                  allSelected={
                    selected.length === orders.length && orders.length > 0
                  }
                  toggleSelectAll={selectAll}
                  bulkDelete={bulkDelete}
                />
              )}

              {active === "Customers" && (
                <CustomersView
                  customers={customers}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  onAdd={() => setShowCustomerModal(true)}
                  allSelected={
                    selected.length === customers.length && customers.length > 0
                  }
                  toggleSelectAll={selectAll}
                  bulkDelete={bulkDelete}
                />
              )}

              {active === "Sellers" && (
                <SellersView
                  sellers={sellers}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  onAdd={() => setShowSellerModal(true)}
                  allSelected={
                    selected.length === sellers.length && sellers.length > 0
                  }
                  toggleSelectAll={selectAll}
                  bulkDelete={bulkDelete}
                />
              )}

              {active === "Payments" && <PaymentsView payments={payments} />}

              {active === "Promotions" && (
                <PromotionsView
                  promotions={promotions}
                  onAdd={() => setShowPromoModal(true)}
                  setPromotions={setPromotions}
                />
              )}

              {active === "Reports" && (
                <ReportsView
                  products={products}
                  orders={orders}
                  customers={customers}
                  sellers={sellers}
                  payments={payments}
                />
              )}

              {active === "Settings" && <SettingsView />}
            </div>
          </main>
        </div>
      </div>
      {productModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setProductModalOpen(false)}
          onSave={saveProduct}
        />
      )}

      {showCustomerModal && (
        <AddModal
          title="Add Customer"
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "email", label: "Email", required: true },
          ]}
          onClose={() => setShowCustomerModal(false)}
          onSave={(d) => addCustomer(d)}
        />
      )}

      {showSellerModal && (
        <AddModal
          title="Add Seller"
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "email", label: "Email", required: true },
          ]}
          onClose={() => setShowSellerModal(false)}
          onSave={(d) => addSeller(d)}
        />
      )}

      {showPromoModal && (
        <AddModal
          title="New Promotion"
          fields={[
            { key: "code", label: "Code", required: true },
            { key: "discount", label: "Discount (e.g. 10%)", required: true },
            {
              key: "start",
              label: "Start Date",
              required: false,
              placeholder: "YYYY-MM-DD",
            },
            {
              key: "end",
              label: "End Date",
              required: false,
              placeholder: "YYYY-MM-DD",
            },
          ]}
          onClose={() => setShowPromoModal(false)}
          onSave={(d) => addPromo(d)}
        />
      )}
    </div>
  );
}
