import { useMemo, useRef, useState } from "react";
import {
  buildInventoryFromProducts,
  sampleOrders,
  samplePayments,
  sampleProducts,
  sampleReturns,
} from "./SellerHelpers/SellerHelpers";
import Sidebar from "../../../components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import DashboardView from "./views/DashboardView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import InventoryView from "./views/InventoryView";
import PaymentsView from "./views/PaymentsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import * as XLSX from "xlsx";
import Drawer from "../../../components/Drawer/Drawer";
import MyProfile from "./views/MyProfileView";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import MyProfileView from "../../../components/MyProfileView/MyProfileView";

export default function SellerPanelDashboard() {
  const [user, setUser] = useState({
    name: "রাহিম উদ্দিন",
    email: "rahim@example.com",
    phone: "01712345678",
    avatar: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
  });
  // --- Navigation + global data ---
  const [active, setActive] = useState("Dashboard");

  const [showEditProfile, setShowEditProfile] = useState(false);

  // Core data
  const [products, setProducts] = useState(sampleProducts());
  const [orders, setOrders] = useState(sampleOrders());
  const [returns, setReturns] = useState(sampleReturns());
  const [inventory, setInventory] = useState(
    buildInventoryFromProducts(sampleProducts())
  );
  const [payments] = useState(samplePayments());

  // Product UI state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    category: "Fashion",
    images: [],
    stock: 0,
  });
  const fileInputRef = useRef(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Products filters/pagination
  const [productSearch, setProductSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [productPage, setProductPage] = useState(1);
  const productPageSize = 6;

  // Orders filters/pagination
  const [orderSearch, setOrderSearch] = useState("");
  const [orderSort, setOrderSort] = useState("customer");
  const [orderPage, setOrderPage] = useState(1);
  const orderPageSize = 6;
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Payments filters/pagination
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentSort, setPaymentSort] = useState("date");
  const [paymentPage, setPaymentPage] = useState(1);
  const paymentPageSize = 5;

  // Reports filters (status + date range)
  const [reportFilter, setReportFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Settings state (Payment settings split)
  const [bankSettings, setBankSettings] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [bdSettings, setBdSettings] = useState({
    bkash: "",
    nagad: "",
    rocket: "",
  });
  const [profile, setProfile] = useState({
    shopName: "",
    email: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    paymentAlerts: true,
    weeklyReports: false,
  });

  // Security state
  const [oldPasswordStored] = useState("old-password-stub"); // stub - in real app fetch from server
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFA, setTwoFA] = useState("Disabled");
  const [loginAlert, setLoginAlert] = useState("Disabled");

  // Category schema (dynamic product modal)
  const categorySchemas = {
    Fashion: [
      { key: "name", label: "Name", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "brand", label: "Brand", type: "text" },
      { key: "size", label: "Size", type: "text" },
      { key: "color", label: "Color", type: "text" },
    ],
    Electronics: [
      { key: "name", label: "Name", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "model", label: "Model", type: "text" },
      { key: "warranty", label: "Warranty (months)", type: "number" },
    ],
    "Home & Kitchen": [
      { key: "name", label: "Name", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "material", label: "Material", type: "text" },
      { key: "dimensions", label: "Dimensions", type: "text" },
    ],
    Default: [
      { key: "name", label: "Name", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  };

  // --- Derived lists ---
  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (productSearch) {
      const q = productSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    if (productSort === "price")
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (productSort === "stock")
      data.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return data;
  }, [products, productSearch, productSort]);

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize
  );

  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.number || "").toLowerCase().includes(q) ||
          (o.customer || "").toLowerCase().includes(q)
      );
    }
    if (orderSort === "total")
      data.sort((a, b) => (a.total || 0) - (b.total || 0));
    else
      data.sort((a, b) => (a.customer || "").localeCompare(b.customer || ""));
    return data;
  }, [orders, orderSearch, orderSort]);

  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );

  const filteredPayments = useMemo(() => {
    let data = [...payments];
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.method || "").toLowerCase().includes(q) ||
          (p.status || "").toLowerCase().includes(q)
      );
    }
    if (paymentSort === "amount") data.sort((a, b) => a.amount - b.amount);
    else if (paymentSort === "status")
      data.sort((a, b) => a.status.localeCompare(b.status));
    else data.sort((a, b) => new Date(b.date) - new Date(a.date));
    return data;
  }, [payments, paymentSearch, paymentSort]);

  const paginatedPayments = filteredPayments.slice(
    (paymentPage - 1) * paymentPageSize,
    paymentPage * paymentPageSize
  );

  const filteredOrdersForReport = useMemo(() => {
    let data = [...orders];
    if (reportFilter === "completed")
      data = data.filter((o) => o.status === "Completed");
    if (reportFilter === "pending")
      data = data.filter((o) => o.status === "Pending");
    if (reportFilter === "failed")
      data = data.filter((o) => o.status === "Failed");
    if (startDate)
      data = data.filter((o) => new Date(o.date) >= new Date(startDate));
    if (endDate)
      data = data.filter((o) => new Date(o.date) <= new Date(endDate));
    return data;
  }, [orders, reportFilter, startDate, endDate]);

  // --- Handlers & helpers ---
  function openNewProductModal() {
    setEditingProduct(null);
    setProductForm({ category: "Fashion", images: [], stock: 0 });
    setProductModalOpen(true);
  }
  function openEditProductModal(p) {
    setEditingProduct(p);
    setProductForm({ ...p, images: p.images || [], stock: p.stock || 0 });
    setProductModalOpen(true);
  }
  function saveProduct() {
    if (!productForm.name || !productForm.price)
      return alert("Name and price required");
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((x) =>
          x.id === editingProduct.id ? { ...x, ...productForm } : x
        )
      );
    } else {
      const newP = { id: Date.now().toString(), ...productForm };
      setProducts((prev) => [newP, ...prev]);
    }
    setProductModalOpen(false);
  }

  function toggleSelectProduct(id) {
    setSelectedProductIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }
  function bulkDeleteProducts() {
    if (!selectedProductIds.length) return alert("No products selected");
    if (!confirm(`Delete ${selectedProductIds.length} products?`)) return;
    setProducts((p) => p.filter((x) => !selectedProductIds.includes(x.id)));
    setSelectedProductIds([]);
  }

  function toggleSelectOrder(id) {
    setSelectedOrderIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }
  function bulkMarkShipped() {
    if (!selectedOrderIds.length) return alert("No orders selected");
    setOrders((prev) =>
      prev.map((o) =>
        selectedOrderIds.includes(o.id) ? { ...o, status: "Shipped" } : o
      )
    );
    setSelectedOrderIds([]);
  }

  function downloadBlob(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportProductsExcel(list) {
    if (!list.length) return alert("No products");
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Description"];
    const tableRows = [
      `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`,
      ...list.map(
        (p) =>
          `<tr><td>${p.id}</td><td>${escapeHtml(p.name)}</td><td>${escapeHtml(
            p.category
          )}</td><td>${p.price}</td><td>${p.stock}</td><td>${escapeHtml(
            p.description || ""
          )}</td></tr>`
      ),
    ];
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body><table>${tableRows.join(
      ""
    )}</table></body></html>`;
    downloadBlob(html, "products_export.xls", "application/vnd.ms-excel");
  }

  function exportPaymentsExcel() {
    if (!filteredPayments.length) return alert("No data");
    const table = `<table><tr><th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>${filteredPayments
      .map(
        (p) =>
          `<tr><td>${p.id}</td><td>${p.date}</td><td>${p.amount}</td><td>${p.method}</td><td>${p.status}</td></tr>`
      )
      .join("")}</table>`;
    downloadBlob(table, "payments.xls", "application/vnd.ms-excel");
  }

  function exportReportsExcel() {
    if (!filteredOrdersForReport.length) return alert("No data");
    const table = `<table><tr><th>ID</th><th>Status</th><th>Total</th><th>Date</th></tr>${filteredOrdersForReport
      .map(
        (o) =>
          `<tr><td>${o.id}</td><td>${o.status}</td><td>${o.total}</td><td>${o.date}</td></tr>`
      )
      .join("")}</table>`;
    downloadBlob(table, "reports.xls", "application/vnd.ms-excel");
  }

  // Bulk upload
  function handleBulkUploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (ev) => {
      try {
        const textOrBuffer = ev.target.result;
        let created = [];

        // CSV handling
        if (name.endsWith(".csv")) {
          const text =
            typeof textOrBuffer === "string"
              ? textOrBuffer
              : new TextDecoder().decode(textOrBuffer);
          const parsed = parseCSV(text);
          created = parsed.map(mapParsedToProduct);
        }

        // Excel (.xlsx or .xls)
        else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
          const data = new Uint8Array(textOrBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
          created = jsonData.map(mapParsedToProduct);
        }

        // HTML Table (used for Excel export reimport)
        else if (name.endsWith(".html") || name.endsWith(".htm")) {
          const text =
            typeof textOrBuffer === "string"
              ? textOrBuffer
              : new TextDecoder().decode(textOrBuffer);
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, "text/html");
          const table = doc.querySelector("table");
          if (!table) {
            alert("No valid table found in the file");
            return;
          }

          const rows = Array.from(table.querySelectorAll("tr"));
          if (rows.length < 2) {
            alert("Table has no data rows");
            return;
          }

          const headers = Array.from(
            rows.shift().querySelectorAll("th,td")
          ).map((th) => th.textContent.trim());
          const records = rows.map((r) => {
            const cols = Array.from(r.querySelectorAll("td")).map((td) =>
              td.textContent.trim()
            );
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = cols[i] || "";
            });
            return obj;
          });

          created = records.map(mapParsedToProduct);
        }

        // Unsupported file type
        else {
          alert(
            "Unsupported file format. Please upload CSV, XLSX, or HTML table file."
          );
          return;
        }

        if (!created.length) {
          alert("No valid products found in file.");
          return;
        }

        setProducts((prev) => [...created, ...prev]);
        alert(`✅ Successfully imported ${created.length} products.`);
      } catch (error) {
        console.error("Bulk upload error:", error);
        alert(
          "❌ Error processing file. Please check the format and try again."
        );
      } finally {
        e.target.value = "";
      }
    };

    // Read file as array buffer for maximum compatibility
    reader.readAsArrayBuffer(file);
  }

  function mapParsedToProduct(obj) {
    const category = obj.category || obj.Category || "Default";
    const name = obj.name || obj.Name || obj.title || obj.Title || "Untitled";
    const price = Number(obj.price || obj.Price || 0);
    const description = obj.description || obj.Description || "";
    const images = (obj.images || obj.Images || "").split("|").filter(Boolean);
    const stock = Number(obj.stock || obj.Stock || 0);
    const cleaned = {
      id: Date.now().toString() + Math.floor(Math.random() * 1000),
      name,
      category,
      price,
      description,
      images,
      stock,
    };
    Object.keys(obj).forEach((k) => {
      const low = k.toLowerCase();
      if (["sku", "tag"].includes(low)) return;
      if (
        ![
          "name",
          "price",
          "description",
          "images",
          "stock",
          "category",
        ].includes(low)
      )
        cleaned[k] = obj[k];
    });
    return cleaned;
  }

  function parseCSV(text) {
    const rows = [];
    let curr = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"' && text[i + 1] === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else field += ch;
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          curr.push(field);
          field = "";
        } else if (ch === "\r") {
          continue;
        } else if (ch === "\n") {
          curr.push(field);
          rows.push(curr);
          curr = [];
          field = "";
        } else field += ch;
      }
    }
    if (field !== "" || curr.length) curr.push(field);
    if (curr.length) rows.push(curr);
    const headers = (rows.shift() || []).map((h) => h.trim());
    return rows.map((r) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = r[i] ? r[i].trim() : ""));
      return obj;
    });
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }

  function generatePaymentQR() {
    alert("QR generation stub — integrate provider API to make this live");
  }

  // Settings save handlers
  function savePaymentSettings() {
    alert("Payment settings saved (stub)");
  }
  function saveProfileSettings() {
    alert("Profile saved (stub)");
  }
  function saveNotificationSettings() {
    alert("Notification settings saved (stub)");
  }
  function saveSecurity() {
    if (!oldPassword) return alert("Enter old password");
    if (oldPassword !== oldPasswordStored)
      return alert("Old password is incorrect (stub)");
    if (newPassword.length < 6) return alert("New password must be >= 6 chars");
    if (newPassword !== confirmPassword)
      return alert("Password confirmation does not match");
    alert("Password updated (stub)");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
  function ordersByStatus(list) {
    const map = {};
    list.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ status: k, count: map[k] }));
  }
  function revenueBreakdown(list) {
    const map = {};
    list.forEach((o) => {
      (o.items || []).forEach((it) => {
        const prod = sampleProducts().find((p) => p.id === it.productId) || {};
        const cat = prod.category || "Other";
        map[cat] = (map[cat] || 0) + (it.qty || 1) * (it.price || 0);
      });
    });
    if (Object.keys(map).length === 0)
      map["Other"] = list.reduce((a, b) => a + (b.total || 0), 0);
    const palette = ["#FF0055", "#FF7F50", "#FFD700", "#7DD3FC", "#A78BFA"];
    return Object.keys(map).map((k, i) => ({
      label: k,
      value: map[k],
      color: palette[i % palette.length],
    }));
  }
  const calculateRevenue = (orders) => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, order) => sum + order.total, 0);
  };
  const totalRevenue = useMemo(() => calculateRevenue(orders), [orders]);

  const calculateSalesData = (orders) => {
    const data = {};
    const today = new Date().toISOString().substring(0, 10);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substring(0, 10);

    orders
      .filter((o) => o.status !== "Cancelled")
      .forEach((order) => {
        const date = order.date;
        if (date >= oneWeekAgo && date <= today) {
          data[date] = (data[date] || 0) + order.total;
        }
      });
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10);
      chartData.push({
        date: new Date(date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        revenue: data[date] || 0,
      });
    }
    return chartData;
  };
  const salesData = useMemo(() => calculateSalesData(orders), [orders]);
  const handleProfileSave = (e) => {
    e && e.preventDefault();
    setShowEditProfile(false);
    alert("Profile updated");
  };
  // ----- Profile helpers -----
  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: url }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex ">
        <div className="hidden lg:flex">
          <Sidebar
            user={user}
            active={active}
            setActive={setActive}
            products={products}
            orders={orders}
            payments={payments}
            items={[
              "Dashboard",
              "Products",
              "Orders",
              "Inventory",
              "Payments",
              "Reports",
              "My Account",
              "Settings",
            ]}
          />
        </div>
        <div className=" flex-1">
          <Drawer
            user={user}
            activeTab={active}
            setActiveTab={setActive}
            notifications={notifications}
            products={products}
            orders={orders}
            payments={payments}
            items={[
              "Dashboard",
              "Products",
              "Orders",
              "Inventory",
              "Payments",
              "Reports",
              "My Account",
              "Settings",
            ]}
          >
            <main className=" xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3">
              <DashboardView
                active={active}
                products={products}
                orders={orders}
                inventory={inventory}
                salesData={salesData}
              />
              <ProductsView
                active={active}
                products={products}
                setProducts={setProducts}
                productModalOpen={productModalOpen}
                setProductModalOpen={setProductModalOpen}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                productForm={productForm}
                setProductForm={setProductForm}
                fileInputRef={fileInputRef}
                selectedProductIds={selectedProductIds}
                setSelectedProductIds={setSelectedProductIds}
                toggleSelectProduct={toggleSelectProduct}
                bulkDeleteProducts={bulkDeleteProducts}
                openNewProductModal={openNewProductModal}
                openEditProductModal={openEditProductModal}
                saveProduct={saveProduct}
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                productSort={productSort}
                setProductSort={setProductSort}
                productPage={productPage}
                setProductPage={setProductPage}
                productPageSize={productPageSize}
                filteredProducts={filteredProducts}
                paginatedProducts={paginatedProducts}
                categorySchemas={categorySchemas}
                handleBulkUploadFile={handleBulkUploadFile}
                exportProductsExcel={exportProductsExcel}
              />
              <OrdersView
                active={active}
                orders={orders}
                setOrders={setOrders}
                returns={returns}
                setReturns={setReturns}
                selectedOrderIds={selectedOrderIds}
                setSelectedOrderIds={setSelectedOrderIds}
                toggleSelectOrder={toggleSelectOrder}
                bulkMarkShipped={bulkMarkShipped}
                orderSearch={orderSearch}
                setOrderSearch={setOrderSearch}
                orderSort={orderSort}
                setOrderSort={setOrderSort}
                orderPage={orderPage}
                setOrderPage={setOrderPage}
                orderPageSize={orderPageSize}
                filteredOrders={filteredOrders}
                paginatedOrders={paginatedOrders}
              />
              <InventoryView
                active={active}
                inventory={inventory}
                setInventory={setInventory}
              />
              <PaymentsView
                active={active}
                filteredPayments={filteredPayments}
                paginatedPayments={paginatedPayments}
                paymentSearch={paymentSearch}
                setPaymentSearch={setPaymentSearch}
                paymentSort={paymentSort}
                setPaymentSort={setPaymentSort}
                paymentPage={paymentPage}
                setPaymentPage={setPaymentPage}
                paymentPageSize={paymentPageSize}
                exportPaymentsExcel={exportPaymentsExcel}
              />
              <ReportsView
                active={active}
                totalRevenue={totalRevenue}
                products={products}
                filteredOrdersForReport={filteredOrdersForReport}
                reportFilter={reportFilter}
                setReportFilter={setReportFilter}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                exportReportsExcel={exportReportsExcel}
                ordersByStatus={ordersByStatus}
                revenueBreakdown={revenueBreakdown}
              />
              <MyProfileView
                user={user}
                setShowEditProfile={setShowEditProfile}
                activeTab={active}
              />
              <SettingsView
                active={active}
                bankSettings={bankSettings}
                setBankSettings={setBankSettings}
                bdSettings={bdSettings}
                setBdSettings={setBdSettings}
                profile={profile}
                setProfile={setProfile}
                notifications={notifications}
                setNotifications={setNotifications}
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                twoFA={twoFA}
                setTwoFA={setTwoFA}
                loginAlert={loginAlert}
                setLoginAlert={setLoginAlert}
                savePaymentSettings={savePaymentSettings}
                saveProfileSettings={saveProfileSettings}
                saveNotificationSettings={saveNotificationSettings}
                saveSecurity={saveSecurity}
                generatePaymentQR={generatePaymentQR}
              />
            </main>
          </Drawer>
        </div>
      </div>
      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        setUser={setUser}
        showEditProfile={showEditProfile}
        setShowEditProfile={setShowEditProfile}
        handleProfileSave={handleProfileSave}
        handleAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
