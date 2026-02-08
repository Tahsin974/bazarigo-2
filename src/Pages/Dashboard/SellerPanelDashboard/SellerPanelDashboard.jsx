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
  Layers,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function SellerPanelDashboard() {
  const [selected, setSelected] = useState([]);
  const location = useLocation();
  const { user } = useAuth();
  const sessionKey = `activeMenu_${user?.id}`;
  const [active, setActive] = useState(() => {
    if (location?.state) {
      return location.state;
    }
    if (window.location.pathname.includes("/dashboard")) {
      return sessionStorage.getItem(sessionKey) || "Dashboard";
    }
    return "Dashboard";
  });
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

  // Core data

  const { data: payments = [], refetch: refetchPayments } = useQuery({
    queryKey: ["seller-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/seller-payments/${user.id}`);
      return res.data.payments;
    },
  });
  const fileRef = useRef(null);

  // Product UI state

  const currentPageSize = 10;

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
          (p.category || "").toLowerCase().includes(q),
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
        return (a.product_name || "")
          .toLowerCase()
          .localeCompare((b.product_name || "").toLowerCase());
      }
    });

    return data;
  }, [products, productSearch, productSort]);

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * currentPageSize,
    productPage * currentPageSize,
  );
  const filteredInventory = useMemo(() => {
    let data = [...inventory];
    if (inventorySearch) {
      const q = inventorySearch.toLowerCase();
      data = data.filter((p) =>
        (p.product_name || "").toLowerCase().includes(q),
      );
    } else if (inventorySort === "stock")
      data.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else
      data.sort((a, b) => {
        return (a.product_name || "")
          .toLowerCase()
          .localeCompare((b.product_name || "").toLowerCase());
      });
    return data;
  }, [inventory, inventorySearch, inventorySort]);

  const paginatedInventory = filteredInventory.slice(
    (inventoryPage - 1) * currentPageSize,
    inventoryPage * currentPageSize,
  );

  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.order_id || "").toLowerCase().includes(q) ||
          (o.customer_email || "").toLowerCase().includes(q) ||
          (o.customer_name || "").toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [orders, orderSearch]);

  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * currentPageSize,
    orderPage * currentPageSize,
  );

  const filteredReturnOrders = useMemo(() => {
    let data = [...returns];
    if (returnOrderSearch) {
      const q = returnOrderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.id || "").toLowerCase().includes(q) ||
          (o.status || "").toLowerCase().includes(q) ||
          (o.customer || "").toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [returns, returnOrderSearch]);

  const paginatedReturnOrders = filteredReturnOrders.slice(
    (returnOrderPage - 1) * currentPageSize,
    returnOrderPage * currentPageSize,
  );

  const filteredPayments = useMemo(() => {
    let data = [...payments];
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.method || "").toLowerCase().includes(q) ||
          (p.status || "").toLowerCase().includes(q),
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
    paymentPage * currentPageSize,
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
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  };

  const handleExport = () => {
    if (active !== "Products") return;

    const wb = XLSX.utils.book_new();

    // --- Helper: normalize variant ---
    const normalizeVariant = (v) => {
      if (v.attributes) return v;
      const { id, tempId, regular_price, sale_price, stock, ...rest } = v;
      return {
        id,
        tempId,
        attributes: rest,
        regular_price: regular_price || 0,
        sale_price: sale_price || 0,
        stock: stock || 0,
      };
    };

    // --- Products sheet ---
    const productRows = products.map((product) => {
      const parsedVariants = (product.variants || []).map(normalizeVariant);
      const totalStock = parsedVariants.length
        ? parsedVariants.reduce((sum, v) => sum + (v.stock || 0), 0)
        : product.stock || 0;

      return {
        id: product.id,
        productName: product.product_name,
        regular_price: product.regular_price ?? 0,
        sale_price: product.sale_price ?? 0,
        discount: product.discount ?? 0,
        category: product.category ?? "",
        subcategory: product.subcategory ?? "",
        subcategory_item: product.subcategory_item ?? "",
        description: product.description ?? "",
        stock: totalStock,
        brand: product.brand ?? "No Brand",
        weight: product.weight ?? 1,
        images: (product.images || []).join(";"),
        thumbnail: product.thumbnail,
      };
    });

    const productSheet = XLSX.utils.json_to_sheet(productRows);
    productSheet["!cols"] = Object.keys(productRows[0] || {}).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    XLSX.utils.book_append_sheet(wb, productSheet, "Products");

    // --- Variants sheet ---
    const variantRows = [];
    const allAttributeKeys = new Set();

    products.forEach((product) => {
      const parsedVariants = (product.variants || []).map(normalizeVariant);
      parsedVariants.forEach((v) => {
        const row = {
          productId: product.id,
          productName: product.product_name,
          regular_price: v.regular_price,
          sale_price: v.sale_price,
          stock: v.stock,
        };

        // Spread attributes
        if (v.attributes) {
          Object.entries(v.attributes).forEach(([key, value]) => {
            row[key] = value;
            allAttributeKeys.add(key);
          });
        }

        variantRows.push(row);
      });
    });

    if (variantRows.length) {
      const columns = [
        "productId",
        "productName",
        "regular_price",
        "sale_price",
        "stock",
        ...Array.from(allAttributeKeys),
      ];

      // Ensure all rows have all columns
      variantRows.forEach((row) => {
        columns.forEach((col) => {
          if (!(col in row)) row[col] = "";
        });
      });

      const variantSheet = XLSX.utils.json_to_sheet(variantRows, {
        header: columns,
      });
      variantSheet["!cols"] = columns.map((key) => ({
        wch: Math.max(key.length, 20),
      }));
      XLSX.utils.book_append_sheet(wb, variantSheet, "Variants");
    }

    XLSX.writeFile(wb, "Products_export.xlsx");
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
    const file = fileRef.current.files[0];

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // --- Products sheet ---
      const productSheet = workbook.Sheets["Products"];
      const productData = XLSX.utils.sheet_to_json(productSheet, {
        defval: "",
      });

      // --- Variants sheet ---
      const variantSheet = workbook.Sheets["Variants"];
      const variantData = XLSX.utils.sheet_to_json(variantSheet, {
        defval: "",
      });

      const products = productData.map((item) => {
        // --- find variants belonging to this product ---
        const parsedVariants = variantData
          .filter((v) => v.productId === item.productId)
          .map((v) => ({
            id: uuidv4(),
            attributes: JSON.parse(v.attributes || "{}"),
            stock: Number(v.stock || 0),
            regular_price: Number(v.regular_price || 0),
            sale_price: Number(v.sale_price || 0),
          }));

        return {
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
          images: item.images ? item.images.split(";") : [],
          variants: parsedVariants,
        };
      });

      // Send to backend
      const res = await axiosPublic.post("/products/bulk", products);
      if (res.data.insertedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Products Uploaded Successfully",
          toast: true,
          position: "top",
          timer: 1500,
          showConfirmButton: false,
        });
        refetchProducts();
        fileRef.current.value = null;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops! Try Again",
          toast: true,
          position: "top",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `${err.message}`,
        toast: true,
        position: "top",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  useEffect(() => {
    if (window.location.pathname.includes("/dashboard")) {
      sessionStorage.setItem(sessionKey, active);
    }
  }, [active, sessionKey]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="flex ">
        <div className="hidden lg:flex">
          <Sidebar active={active} setActive={setActive} items={navItems} />
        </div>
        <div className=" flex-1">
          <Drawer
            user={user}
            activeTab={active}
            setActiveTab={setActive}
            messages={myMessages}
            items={navItems}
          >
            <main className=" xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 ">
                {/* Left: Page Title */}
                <h1 className="xl:text-xl lg:text-xl md:text-xl sm:text-lg font-bold order-1 lg:order-1 flex items-center gap-2">
                  {active === "Inventory" ? (
                    <>
                      <Layers className="text-[#FF0055]" />
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
                          Inventory Management
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
                      {active}
                    </span>
                  )}
                </h1>

                {/* Right: Buttons + Admin */}

                <div className="items-center  order-2 lg:order-2 flex gap-2 justify-end w-full md:w-auto">
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
              <div className="py-3">
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
                  inventoryPageSize={6}
                  filteredInventory={filteredInventory}
                  paginatedInventory={paginatedInventory}
                />
                <NotificationsView
                  activeTab={active}
                  setActiveTab={setActive}
                />
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
              </div>
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
          onClose={() => setProductModalOpen(false)}
          refetch={refetchProducts}
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
