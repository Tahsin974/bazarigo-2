import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../../../components/Sidebar/Sidebar";
import DashboardView from "./views/DashboardView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import InventoryView from "./views/InventoryView";
import PaymentsView from "./views/PaymentsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import Drawer from "../../../components/Drawer/Drawer";

import ExportBtn from "../../../components/ui/ExportBtn";

import useAuth from "../../../Utils/Hooks/useAuth";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import MessageModal from "../../../components/Modals/MessageModal/MessageModal";
import ProductModal from "../../../components/Modals/ProductModal/ProductModal";
import MyProfileView from "../../../components/MyProfileView/MyProfileView";
import useAxiosSecure from "../../../Utils/Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import EditProductModal from "../../../components/Modals/EditProductModal/EditProductModal";
import PreviewModal from "../../../components/Modals/PreviewModal/PreviewModal";
import OrderModal from "../../../components/Modals/OrderModal/OrderModal";
import NotificationsView from "../../../components/NotificationsView/NotificationsView";
import MessagesView from "../../../components/MessagesView/MessagesView";
import { useLocation } from "react-router";
import useSuperAdmin from "../../../Utils/Hooks/useSuperAdmin";
import useMessages from "../../../Utils/Hooks/useMessages";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";

export default function SellerPanelDashboard() {
  const [selected, setSelected] = useState([]);
  const location = useLocation();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const { bazarigo } = useSuperAdmin();
  const navItems = [
    { label: "Dashboard", icon: <Home size={18} /> },
    { label: "Products", icon: <Package size={18} /> },
    { label: "Orders", icon: <ShoppingCart size={18} /> },
    { label: "Inventory", icon: <Boxes size={18} /> },
    { label: "Payments", icon: <CreditCard size={18} /> },
    { label: "Reports", icon: <BarChart3 size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
  ];

  const axiosSecure = useAxiosSecure();
  const { data: products = [], refetch: refetchProducts } = useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/seller/${user.id}`);
      return res.data.products;
    },
  });

  const {
    data: inventory = [],

    refetch: refetchInventory,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/inventory/${user.id}`);
      return res.data.inventory;
    },
  });

  console.log(inventory);
  const {
    data: orders = [],

    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/seller/${user.id}`);
      return res.data.orders;
    },
  });
  const {
    data: returns = [],

    refetch: refetchReturnsOrders,
  } = useQuery({
    queryKey: ["seller-return-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/return-orders/seller/${user.id}`);
      return res.data.returnOrders;
    },
  });
  const { myMessages } = useMessages();

  // --- Navigation + global data ---
  const [active, setActive] = useState(location?.state || "Dashboard");

  // Core data

  const { data: payments = [], refetch: refetchPayments } = useQuery({
    queryKey: ["seller-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-payments/${user.id}`);
      return res.data.payments;
    },
  });
  console.log(payments);
  const fileRef = useRef(null);

  // Product UI state

  const currentPageSize = 6;

  // Products filters/pagination
  const [productSearch, setProductSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [productPage, setProductPage] = useState(1);

  // Orders filters/pagination
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);

  const [returnOrderSearch, setReturnOrderSearch] = useState("");
  const [returnOrderPage, setReturnOrderPage] = useState(1);

  // Payments filters/pagination
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentSort, setPaymentSort] = useState("date");
  const [paymentPage, setPaymentPage] = useState(1);

  // inventory filters/pagination
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventorySort, setInventorySort] = useState("name");
  const [inventoryPage, setInventoryPage] = useState(1);

  // Modal controls

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [activeOrder, setActiveOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(null);

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);

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
    data = data.sort((a, b) => {
      if (productSort === "stock") return (b.stock || 0) - (a.stock || 0);
      if (productSort === "price")
        return (
          (b.sale_price > 0 ? b.sale_price : b.regular_price) -
          (a.sale_price > 0 ? a.sale_price : a.regular_price)
        );
      else {
        (a.product_name || "").localeCompare(b.product_name || "");
      }
    });

    return data;
  }, [products, productSearch, productSort]);

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * currentPageSize,
    productPage * currentPageSize
  );
  const filteredInventory = useMemo(() => {
    let data = [...inventory];
    if (inventorySearch) {
      const q = inventorySearch.toLowerCase();
      data = data.filter((p) =>
        (p.product_name || "").toLowerCase().includes(q)
      );
    } else if (inventorySort === "stock")
      data.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else
      data.sort((a, b) =>
        (a.product_name || "").localeCompare(b.product_name || "")
      );
    return data;
  }, [inventory, inventorySearch, inventorySort]);

  const paginatedInventory = filteredInventory.slice(
    (inventoryPage - 1) * currentPageSize,
    inventoryPage * currentPageSize
  );

  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.order_id || "").toLowerCase().includes(q) ||
          (o.customer_email || "").toLowerCase().includes(q) ||
          (o.customer_name || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [orders, orderSearch]);

  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * currentPageSize,
    orderPage * currentPageSize
  );

  const filteredReturnOrders = useMemo(() => {
    let data = [...returns];
    if (returnOrderSearch) {
      const q = returnOrderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.id || "").toLowerCase().includes(q) ||
          (o.status || "").toLowerCase().includes(q) ||
          (o.customer || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [returns, returnOrderSearch]);

  const paginatedReturnOrders = filteredReturnOrders.slice(
    (returnOrderPage - 1) * currentPageSize,
    returnOrderPage * currentPageSize
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
    (paymentPage - 1) * currentPageSize,
    paymentPage * currentPageSize
  );

  // --- Handlers & helpers ---
  const openNewProductModal = () => {
    setProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setActiveProduct(product);
    setEditProductModalOpen(true);
  };
  const openOrderModal = (order) => {
    setOrderModalOpen(true);
    setActiveOrder(order);
  };
  const openPreviewModal = (product) => {
    setPreviewModalOpen(true);
    setActiveProduct(product);
  };

  const openMessageModal = (user) => {
    setActiveMessage(user);
    setMessageModalOpen(true);
  };

  // Bulk upload
  useEffect(() => {
    if (selected.length !== 0) {
      setSelected([]);
    }
  }, [active, products, orders]);

  const toggleSelect = (id) => {
    console.log(id);
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const handleExport = () => {
    let rows = [];

    if (active === "Products") {
      rows = products.map((product) => ({
        id: product.id,
        productName: product.product_name,
        regular_price: product.regular_price ?? 0,
        sale_price: product.sale_price ?? 0,
        discount: product.discount ?? 0,
        // rating: Number(product.rating),
        // isBestSeller: product.isbestseller ? "Yes" : "No",
        // isHot: product.ishot ? "Yes" : "No",
        // isNew: product.isnew ? "Yes" : "No",
        // isTrending: product.istrending ? "Yes" : "No",
        // isLimitedStock: product.islimitedstock ? "Yes" : "No",
        // isExclusive: product.isexclusive ? "Yes" : "No",
        // isFlashSale: product.isflashsale ? "Yes" : "No",
        category: product.category ?? "",
        subcategory: product.subcategory ?? "",
        description: product.description ?? "",
        stock: product.stock ?? 0,
        brand: product.brand ?? "No Brand",
        weight: product.weight ?? 1,
        images: (product.images || []).join(";"), // multiple images separated by ;
        extras: JSON.stringify(product.extras || {}, null, 2),
        // createdAt: product.createdat
        //   ? new Date(product.createdat).toISOString()
        //   : new Date\(\)\.toISOString\(\),
        // updatedAt: product.updatedat
        //   ? new Date(product.updatedat).toISOString()
        //   : "",
        // sellerId: product.sellerid ?? "",
        // sellerName: product.sellername ?? "",
        // sellerStoreName: product.sellerstorename ?? "",
      }));
    }

    if (active === "Orders")
      rows = orders.map(({ items, ...rest }) => ({
        ...rest,
        items_count: items.length,
      }));

    if (active === "Payments") rows = payments;

    if (!rows.length) return alert("Nothing to export for this section");

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Optional: set column widths
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, active);
    XLSX.writeFile(wb, `${active}_export.xlsx`);
  };

  const selectAll = () => {
    if (active === "Products") {
      const id = products.map((p) => p.id);
      setSelected(selected.length === id.length ? [] : id);
    }
    if (active === "Orders") {
      const id = orders.map((o) => o.order_id);
      setSelected(selected.length === id.length ? [] : id);
    }
  };

  const handleBulkUpload = async () => {
    const file = fileRef.current.files[0]; // get file from ref

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Convert boolean/number fields
      const products = jsonData.map((item) => ({
        ...item,
        isBestSeller: false,
        isHot: false,
        isNew: true,
        isTrending: false,
        isLimitedStock: false,
        isExclusive: false,
        isFlashSale: false,
        regular_price: Number(item.regular_price || 0),
        sale_price: Number(item.sale_price || 0),
        discount: Number(item.discount || 0),
        rating: Number(item.rating || 0),
        stock: Number(item.stock || 0),
        weight: 1,
        productName: item.productName,
        images: item.images ? item.images.split(";") : [],
        extras: item.extras ? JSON.parse(item.extras) : {},
        createdAt: new Date().toLocaleString("en-CA", {
          timeZone: "Asia/Dhaka",
          hour12: false,
        }),
        updatedAt: item.updatedAt || null,
        seller_id: user.id,
        seller_name: user.full_name,
        seller_store_name: user.store_name,
      }));

      const res = await axiosPublic.post("/products/bulk", products);

      if (res.data.insertedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Product Upload Successfully",
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
        refetchProducts();
        return (fileRef.current.value = null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Opps! Try Again",
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
      }

      // Reset file input
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `${err.message}`,
        showConfirmButton: false,
        toast: true,
        position: "top",
        timer: 1500,
      });
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
            items={navItems}
          />
        </div>
        <div className=" flex-1">
          <Drawer
            user={user}
            activeTab={active}
            setActiveTab={setActive}
            products={products}
            orders={orders}
            payments={payments}
            messages={myMessages}
            items={navItems}
          >
            <main className=" xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                {/* Left: Page Title */}
                <h1 className="xl:text-2xl lg:text-2xl md:text-2xl sm:text-xl text-lg font-bold order-1 lg:order-1">
                  {active}
                </h1>

                {/* Right: Buttons + Admin */}

                <div className="flex flex-wrap items-center gap-3 order-2 lg:order-2">
                  {![
                    "Dashboard",
                    "My Account",
                    "Settings",
                    "FlashSale",
                    "Notifications",
                  ].includes(active) && (
                    <>
                      {active === "Products" && (
                        <>
                          <input
                            ref={fileRef}
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={handleBulkUpload}
                          />
                          <button
                            onClick={() =>
                              fileRef.current && fileRef.current.click()
                            }
                            className="btn border-none rounded shadow bg-[#00C853] hover:bg-[#00B34A] text-white sm:text-base text-[14px]"
                          >
                            Bulk Upload
                          </button>
                          <ExportBtn exportBtnHandler={handleExport} />
                        </>
                      )}

                      {active === "Messages" && (
                        <button
                          onClick={() => openMessageModal(bazarigo)}
                          className="btn border-none rounded shadow bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white sm:text-base text-[14px]"
                        >
                          Chat with Bazarigo
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <DashboardView active={active} />
              <ProductsView
                active={active}
                products={products}
                selected={selected}
                toggleSelect={toggleSelect}
                openNewProductModal={openNewProductModal}
                openEditProductModal={openEditProductModal}
                openPreviewModal={openPreviewModal}
                allSelected={
                  selected.length === products.length && products.length > 0
                }
                toggleSelectAll={selectAll}
                productPage={productPage}
                productPageSize={currentPageSize}
                setProductPage={setProductPage}
                filteredProducts={filteredProducts}
                paginatedProducts={paginatedProducts}
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                productSort={productSort}
                setProductSort={setProductSort}
                refetch={refetchProducts}
              />
              <OrdersView
                active={active}
                orders={orders}
                returns={returns}
                openOrderModal={openOrderModal}
                selected={selected}
                toggleSelect={toggleSelect}
                refetch={refetchOrders}
                refetchReturnsOrders={refetchReturnsOrders}
                allSelected={
                  selected.length === orders.length && orders.length > 0
                }
                toggleSelectAll={selectAll}
                orderPage={orderPage}
                setOrderPage={setOrderPage}
                orderPageSize={currentPageSize}
                paginatedOrders={paginatedOrders}
                orderSearch={orderSearch}
                setOrderSearch={setOrderSearch}
                filteredOrders={filteredOrders}
                returnOrderSearch={returnOrderSearch}
                setReturnOrderSearch={setReturnOrderSearch}
                filteredReturnOrders={filteredReturnOrders}
                paginatedReturnOrders={paginatedReturnOrders}
                returnOrderPage={returnOrderPage}
                setReturnOrderPage={setReturnOrderPage}
                returnOrderPageSize={currentPageSize}
              />
              <InventoryView
                active={active}
                inventory={inventory}
                refetch={refetchInventory}
                refetchProducts={refetchProducts}
                inventorySearch={inventorySearch}
                setInventorySearch={setInventorySearch}
                inventorySort={inventorySort}
                setInventorySort={setInventorySort}
                inventoryPage={inventoryPage}
                setInventoryPage={setInventoryPage}
                inventoryPageSize={currentPageSize}
                filteredInventory={filteredInventory}
                paginatedInventory={paginatedInventory}
              />
              <NotificationsView activeTab={active} setActiveTab={setActive} />
              <PaymentsView
                active={active}
                payments={payments}
                filteredPayments={filteredPayments}
                paginatedPayments={paginatedPayments}
                paymentSearch={paymentSearch}
                setPaymentSearch={setPaymentSearch}
                paymentSort={paymentSort}
                setPaymentSort={setPaymentSort}
                paymentPage={paymentPage}
                setPaymentPage={setPaymentPage}
                paymentPageSize={currentPageSize}
                refetch={refetchPayments}
              />
              {active === "Messages" && (
                <MessagesView
                  messages={myMessages}
                  openMessageModal={openMessageModal}
                />
              )}
              <ReportsView active={active} />
              <MyProfileView user={user} activeTab={active} />
              <SettingsView active={active} />
            </main>
          </Drawer>
        </div>
      </div>

      {messageModalOpen && (
        <MessageModal
          onClose={() => setMessageModalOpen(false)}
          user={activeMessage}
          senderId={user.id}
          senderRole={user.role}
        />
      )}

      {productModalOpen && (
        <ProductModal
          user={user}
          product={activeProduct}
          onClose={() => setProductModalOpen(false)}
        />
      )}

      {orderModalOpen && (
        <OrderModal
          order={activeOrder}
          onClose={() => setOrderModalOpen(false)}
        />
      )}

      {previewModalOpen && (
        <PreviewModal
          product={activeProduct}
          onClose={() => setPreviewModalOpen(false)}
        />
      )}

      {editProductModalOpen && (
        <EditProductModal
          product={activeProduct}
          onClose={() => setEditProductModalOpen(false)}
          refetch={refetchProducts}
        />
      )}
    </div>
  );
}
