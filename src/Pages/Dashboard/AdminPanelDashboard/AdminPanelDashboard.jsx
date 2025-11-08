import { useEffect, useMemo, useRef, useState } from "react";
import { samplePromos } from "./helpers/helpers";
import * as XLSX from "xlsx";
import DashboardView from "./views/DashboardView";
import ProductsView from "./views/ProductsView";
import OrdersView from "./views/OrdersView";
import CustomersView from "./views/CustomersView";
import SellersView from "./views/SellersView";
import PromotionsView from "./views/PromotionsView";
import PaymentsView from "./views/PaymentsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";

import ExportBtn from "../../../components/ui/ExportBtn";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import MyProfileView from "../../../components/MyProfileView/MyProfileView";
import Drawer from "../../../components/Drawer/Drawer";
import ProductModal from "../../../components/ProductModal/ProductModal";
import {
  sampleOrders,
  sampleReturns,
  sampleUsers,
} from "../../../Utils/Helpers/Helpers";
import AddSellerModal from "../../../components/AddSellerModal/AddSellerModal";
import FlashSaleView from "./views/FlashSaleView";
import DiscountModal from "../../../components/DiscountModal/DiscountModal";
import axios from "axios";
import ZoneView from "./views/ZoneView";
import { useQuery } from "@tanstack/react-query";
import PreviewModal from "../../../components/PreviewModal/PreviewModal";
import EditProductModal from "../../../components/EditProductModal/EditProductModal";
import OrderModal from "../../../components/OrderModal/OrderModal";
import SellerModal from "../../../components/SellerModal/SellerModal";
import CustomerModal from "../../../components/CustomerModal/CustomerModal";
import AddCustomerModal from "../../../components/AddCustomerModal/AddCustomerModal";

import Swal from "sweetalert2";
import AddPromotionModal from "../../../components/AddPromotionModal/AddPromotionModal";

export default function AdminPanelDashboard() {
  const [user, setUser] = useState({
    name: "রাহিম উদ্দিন",
    email: "rahim@example.com",
    phone: "01712345678",
    avatar: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
  });
  const [active, setActive] = useState("Dashboard");
  const [showEditProfile, setShowEditProfile] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/products");
      return res.data.products;
    },
  });
  const [displayProducts, setDisplayProducts] = useState(products);

  const [orders, setOrders] = useState(sampleOrders());
  const [returns, setReturns] = useState(sampleReturns());
  const [customers, setCustomers] = useState(sampleUsers());

  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const newSampleSellers = async () => {
      const res = await axios.get("http://localhost:3000/sellers");

      setSellers(res.data.sellers);
    };
    newSampleSellers();
  }, []);
  const { data: payments = [], refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/payments");
      return res.data.payments;
    },
  });
  const [promotions, setPromotions] = useState(samplePromos());

  const [selected, setSelected] = useState([]);

  // Shared states for search/sort
  const [productSearch, setProductSearch] = useState("");
  const [postalZoneSearch, setPostalZoneSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [orderSearch, setOrderSearch] = useState("");
  const [returnOrderSearch, setReturnOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [promoSearch, setPromoSearch] = useState("");

  // Pagination states
  const [orderPage, setOrderPage] = useState(1);
  const [returnOrderPage, setReturnOrderPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [sellerPage, setSellerPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [promoPage, setPromoPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [postalZonePage, setPostalZonePage] = useState(1);

  const productPageSize = 6;
  const orderPageSize = 6;
  const returnOrderPageSize = 6;
  const customerPageSize = 6;
  const sellerPageSize = 6;
  const paymentPageSize = 6;
  const promoPageSize = 6;
  const postalZonePageSize = 6;

  // Modal controls
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const [orderModalOpen, setOrderModalOpen] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [showAddCustomerModal, setAddShowCustomerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // FlashSale
  const [flashSaleProductPage, setFlashSaleProductPage] = useState(1);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);

  const [duration, setDuration] = useState(0);
  const [discountModal, setDiscountModal] = useState(false);
  const [manualDiscount, setManualDiscount] = useState({});
  const [manualDiscountValue, setManualDiscountValue] = useState("");
  const [activeDiscountProduct, setActiveDiscountProduct] = useState(null);

  // File input ref for bulk upload
  const fileRef = useRef(null);

  useEffect(() => setSelected([]), [active, displayProducts, products]);

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const bulkDelete = () => {
    if (!selected.length) return alert("No items selected");
    if (!confirm(`Delete ${selected.length} selected items?`)) return;
    if (active === "Products")
      // setProducts((p) => p.filter((x) => !selected.includes(x.id)));
      setDisplayProducts((p) => p.filter((x) => !selected.includes(x.id)));
    if (active === "Orders")
      setOrders((o) => o.filter((x) => !selected.includes(x.id)));
    if (active === "Customers")
      setCustomers((c) => c.filter((x) => !selected.includes(x.id)));
    if (active === "Sellers")
      setSellers((s) => s.filter((x) => !selected.includes(x.id)));
    setSelected([]);
  };

  const handleExport = () => {
    let rows = [];

    if (active === "Products") {
      rows = products.map((product) => ({
        id: product.id,
        productName: product.product_name,
        "regular price": product.regular_price ?? 0,
        "sale price": product.sale_price ?? 0,
        discount: product.discount ?? 0,
        rating: Number(product.rating),
        isBestSeller: product.isbestseller ? "true" : "false",
        isHot: product.ishot ? "true" : "false",
        isNew: product.isnew ? "true" : "false",
        isTrending: product.istrending ? "true" : "false",
        isLimitedStock: product.islimitedstock ? "true" : "false",
        isExclusive: product.isexclusive ? "true" : "false",
        isFlashSale: product.isflashsale ? "true" : "false",
        category: product.category ?? "",
        subcategory: product.subcategory ?? "",
        description: product.description ?? "",
        stock: product.stock ?? 0,
        brand: product.brand ?? "",
        weight: product.weight ?? 1,
        images: (product.images || []).join(";"), // multiple images separated by ;
        extras: JSON.stringify(product.extras || {}, null, 2),
        createdAt: product.createdat
          ? new Date(product.createdat).toISOString()
          : new Date().toISOString(),
        updatedAt: product.updatedat
          ? new Date(product.updatedat).toISOString()
          : "",
        sellerId: product.sellerid ?? "",
        sellerName: product.sellername ?? "",
        sellerStoreName: product.sellerstorename ?? "",
      }));
    }

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

    // ✅ Create Excel workbook
    const wb = XLSX.utils.book_new();

    // ✅ Convert data to sheet
    const ws = XLSX.utils.json_to_sheet(rows);

    // ✅ Optional: Set column width automatically
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, 20),
    }));
    ws["!cols"] = colWidths;

    // ✅ Add sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, active);

    // ✅ Save Excel file
    XLSX.writeFile(wb, `${active}_export.xlsx`);
  };

  const selectAll = () => {
    if (active === "Products" || active === "FlashSale") {
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
        isBestSeller:
          item.isBestSeller === true || item.isBestSeller === "true",
        isHot: item.isHot === true || item.isHot === "true",
        isNew: item.isNew === true || item.isNew === "true",
        isTrending: item.isTrending === true || item.isTrending === "true",
        isLimitedStock:
          item.isLimitedStock === true || item.isLimitedStock === "true",
        isExclusive: item.isExclusive === true || item.isExclusive === "true",
        isFlashSale: item.isFlashSale === true || item.isFlashSale === "true",
        "regular price": Number(item["regular price"] || 0),
        "sale price": Number(item["sale price"] || 0),
        discount: Number(item.discount || 0),
        rating: Number(item.rating || 0),
        stock: Number(item.stock || 0),
        weight: Number(item.weight || 1),
        productName: item.productName,
        images: item.images ? item.images.split(";") : [],
        extras: item.extras ? JSON.parse(item.extras) : {},
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || null,
      }));

      const res = await axios.post(
        "http://localhost:3000/products/bulk",
        products
      );

      if (res.data.insertedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Customer Create Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        return (fileRef.current.value = null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Opps! Try Again",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // Reset file input
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: `${err.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
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
  const openSellerModal = (seller) => {
    setSellerModalOpen(true);
    setActiveSeller(seller);
  };
  const openCustomerModal = (customer) => {
    setCustomerModalOpen(true);
    setActiveCustomer(customer);
  };

  const addSeller = (data) =>
    setSellers((s) => [{ id: `s_${Date.now()}`, ...data }, ...s]);
  const addPromo = (data) =>
    setPromotions((p) => [
      { id: `promo_${Date.now()}`, active: true, ...data },
      ...p,
    ]);

  const filteredProducts = useMemo(() => {
    let data = [...products];
    if (productSearch) {
      const q = productSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.product_name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }
    if (productSort === "price")
      data.sort((a, b) => (a.regular_price || 0) - (b.regular_price || 0));
    else if (productSort === "stock")
      data.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else if (productSort === "rating")
      data.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    else
      data.sort((a, b) =>
        (a.product_name || "").localeCompare(b.product_name || "")
      );
    return data;
  }, [products, productSearch, productSort]);

  // 📦 Orders Filtering & Sorting
  const filteredOrders = useMemo(() => {
    let data = [...orders];
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.id || "").toLowerCase().includes(q) ||
          (o.status || "").toLowerCase().includes(q) ||
          (o.customer || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [orders, orderSearch]);

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

  // 👥 Customers Filtering & Sorting
  const filteredCustomers = useMemo(() => {
    let data = [...customers];
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      data = data.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return data;
  }, [customers, customerSearch]);

  // 🧑‍💼 Sellers Filtering & Sorting
  const filteredSellers = useMemo(() => {
    let data = [...sellers];
    if (sellerSearch) {
      const q = sellerSearch.toLowerCase();
      data = data.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return data;
  }, [sellers, sellerSearch]);

  // 💳 Payments Filtering & Sorting
  const filteredPayments = useMemo(() => {
    let data = [...payments];
    if (paymentSearch) {
      const q = paymentSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.id || "").toLowerCase().includes(q) ||
          (p.method || "").toLowerCase().includes(q) ||
          (p.status || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return data;
  }, [payments, paymentSearch]);
  //  🎟️ Promotions Filtering & Sorting
  const filteredPromotions = useMemo(() => {
    let data = [...promotions];
    if (promoSearch) {
      const q = promoSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.code || "").toLowerCase().includes(q) ||
          (p.discount || "").toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
    return data;
  }, [promotions, promoSearch]);

  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * productPageSize,
    productPage * productPageSize
  );
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * orderPageSize,
    orderPage * orderPageSize
  );
  const paginatedReturnOrders = filteredReturnOrders.slice(
    (returnOrderPage - 1) * returnOrderPageSize,
    returnOrderPage * returnOrderPageSize
  );
  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customerPageSize,
    customerPage * customerPageSize
  );
  const paginatedSellers = filteredSellers.slice(
    (sellerPage - 1) * sellerPageSize,
    sellerPage * sellerPageSize
  );
  const paginatedPayments = filteredPayments.slice(
    (paymentPage - 1) * paymentPageSize,
    paymentPage * paymentPageSize
  );
  const paginatedPromotions = filteredPromotions.slice(
    (promoPage - 1) * 6,
    promoPage * 6
  );

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

  const openDiscountModal = (product) => {
    setActiveDiscountProduct(product);
    setDiscountModal(true);
  };

  const handleSetDiscount = (product) => {
    setManualDiscount({
      id: product.id,
      discount: Number(manualDiscountValue),
    });
    setDiscountModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <>
        <div className="flex">
          <div className="hidden lg:flex">
            <Sidebar
              active={active}
              setActive={setActive}
              products={products}
              orders={orders}
              payments={payments}
              customers={customers}
              sellers={sellers}
              promotions={promotions}
              items={[
                "Dashboard",
                "Products",
                "FlashSale",
                "Orders",
                "Customers",
                "Sellers",
                "Payments",
                "Promotions",
                "Reports",
                "Coverage Areas",
                "My Account",
                "Settings",
              ]}
            />
          </div>

          <div className="flex-1 ">
            <Drawer
              user={user}
              activeTab={active}
              setActiveTab={setActive}
              products={products}
              orders={orders}
              payments={payments}
              items={[
                "Dashboard",
                "Products",
                "FlashSale",
                "Orders",
                "Customers",
                "Sellers",
                "Payments",
                "Promotions",
                "Reports",
                "Coverage Areas",
                "My Account",
                "Settings",
              ]}
            >
              <main className="xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  {/* Left: Page Title */}
                  <h1 className="xl:text-2xl lg:text-2xl md:text-2xl sm:text-xl text-lg font-bold order-1 lg:order-1">
                    {active}
                  </h1>

                  {/* Right: Buttons + Admin */}
                  <div className="flex flex-wrap items-center gap-3 order-2 lg:order-2">
                    {active !== "Dashboard" &&
                      active !== "My Account" &&
                      active !== "Settings" &&
                      active !== "FlashSale" && (
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
                                className="btn  border-none rounded shadow bg-[#00C853] hover:bg-[#00B34A] text-white sm:text-base text-[14px]"
                              >
                                Bulk Upload
                              </button>
                            </>
                          )}
                          <ExportBtn exportBtnHandler={handleExport} />
                        </>
                      )}
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
                      openPreviewModal={openPreviewModal}
                      // setProducts={setProducts}
                      setDisplayProducts={setDisplayProducts}
                      allSelected={
                        selected.length === products.length &&
                        products.length > 0
                      }
                      toggleSelectAll={selectAll}
                      bulkDelete={bulkDelete}
                      productPage={productPage}
                      productPageSize={productPageSize}
                      setProductPage={setProductPage}
                      filteredProducts={filteredProducts}
                      paginatedProducts={paginatedProducts}
                      productSearch={productSearch}
                      setProductSearch={setProductSearch}
                      productSort={productSort}
                      setProductSort={setProductSort}
                    />
                  )}
                  {active === "FlashSale" && (
                    <FlashSaleView
                      products={products}
                      setDisplayProducts={setDisplayProducts}
                      displayProducts={displayProducts}
                      selected={selected}
                      setSelected={setSelected}
                      toggleSelect={toggleSelect}
                      allSelected={
                        selected.length === products.length &&
                        products.length > 0
                      }
                      toggleSelectAll={selectAll}
                      productPage={productPage}
                      productPageSize={productPageSize}
                      setProductPage={setProductPage}
                      filteredProducts={filteredProducts}
                      paginatedProducts={paginatedProducts}
                      productSearch={productSearch}
                      setProductSearch={setProductSearch}
                      productSort={productSort}
                      setProductSort={setProductSort}
                      flashSaleProducts={flashSaleProducts}
                      setFlashSaleProducts={setFlashSaleProducts}
                      manualDiscount={manualDiscount}
                      setManualDiscount={setManualDiscount}
                      flashSaleProductPage={flashSaleProductPage}
                      setFlashSaleProductPage={setFlashSaleProductPage}
                      duration={duration}
                      setDuration={setDuration}
                      discountModal={discountModal}
                      setDiscountModal={setDiscountModal}
                      openDiscountModal={openDiscountModal}
                      manualDiscountValue={manualDiscountValue}
                      setManualDiscountValue={setManualDiscountValue}
                      handleSetDiscount={handleSetDiscount}
                      activeDiscountProduct={activeDiscountProduct}
                    />
                  )}

                  {active === "Orders" && (
                    <OrdersView
                      orders={orders}
                      returns={returns}
                      setReturns={setReturns}
                      openOrderModal={openOrderModal}
                      selected={selected}
                      toggleSelect={toggleSelect}
                      setOrders={setOrders}
                      allSelected={
                        selected.length === orders.length && orders.length > 0
                      }
                      toggleSelectAll={selectAll}
                      bulkDelete={bulkDelete}
                      orderPage={orderPage}
                      setOrderPage={setOrderPage}
                      orderPageSize={orderPageSize}
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
                      returnOrderPageSize={returnOrderPageSize}
                    />
                  )}

                  {active === "Customers" && (
                    <CustomersView
                      customers={customers}
                      selected={selected}
                      toggleSelect={toggleSelect}
                      onAdd={() => setAddShowCustomerModal(true)}
                      allSelected={
                        selected.length === customers.length &&
                        customers.length > 0
                      }
                      openCustomerModal={openCustomerModal}
                      toggleSelectAll={selectAll}
                      bulkDelete={bulkDelete}
                      customerPage={customerPage}
                      setCustomerPage={setCustomerPage}
                      customerPageSize={customerPageSize}
                      paginatedCustomers={paginatedCustomers}
                      filteredCustomers={filteredCustomers}
                      customerSearch={customerSearch}
                      setCustomerSearch={setCustomerSearch}
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
                      openSellerModal={openSellerModal}
                      toggleSelectAll={selectAll}
                      bulkDelete={bulkDelete}
                      sellerPage={sellerPage}
                      setSellerPage={setSellerPage}
                      sellerPageSize={sellerPageSize}
                      paginatedSellers={paginatedSellers}
                      filteredSellers={filteredSellers}
                      sellerSearch={sellerSearch}
                      setSellerSearch={setSellerSearch}
                    />
                  )}

                  {active === "Payments" && (
                    <PaymentsView
                      payments={payments}
                      refetch={refetch}
                      paymentPage={paymentPage}
                      setPaymentPage={setPaymentPage}
                      paymentSearch={paymentSearch}
                      setPaymentSearch={setPaymentSearch}
                      paymentPageSize={paymentPageSize}
                      filteredPayments={filteredPayments}
                      paginatedPayments={paginatedPayments}
                    />
                  )}

                  {active === "Promotions" && (
                    <PromotionsView
                      promotions={promotions}
                      onAdd={() => setShowPromoModal(true)}
                      setPromotions={setPromotions}
                      promoPage={promoPage}
                      setPromoPage={setPromoPage}
                      promoSearch={promoSearch}
                      setPromoSearch={setPromoSearch}
                      promoPageSize={promoPageSize}
                      filteredPromotions={filteredPromotions}
                      paginatedPromotions={paginatedPromotions}
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
                  {active === "Coverage Areas" && (
                    <ZoneView
                      setPostalZoneSearch={setPostalZoneSearch}
                      postalZoneSearch={postalZoneSearch}
                      postalZonePage={postalZonePage}
                      setPostalZonePage={setPostalZonePage}
                      postalZonePageSize={postalZonePageSize}
                    />
                  )}

                  {active === "My Account" && (
                    <MyProfileView
                      user={user}
                      setShowEditProfile={setShowEditProfile}
                      activeTab={active}
                    />
                  )}
                  {active === "Settings" && <SettingsView />}
                </div>
              </main>
            </Drawer>
          </div>
        </div>

        <EditProfileModal
          user={user}
          setUser={setUser}
          showEditProfile={showEditProfile}
          setShowEditProfile={setShowEditProfile}
          handleProfileSave={handleProfileSave}
          handleAvatarChange={handleAvatarChange}
        />
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

        {sellerModalOpen && (
          <SellerModal
            seller={activeSeller}
            onClose={() => setSellerModalOpen(false)}
          />
        )}
        {customerModalOpen && (
          <CustomerModal
            customer={activeCustomer}
            onClose={() => setCustomerModalOpen(false)}
          />
        )}

        {editProductModalOpen && (
          <EditProductModal
            product={activeProduct}
            onClose={() => setEditProductModalOpen(false)}
          />
        )}

        {productModalOpen && (
          <ProductModal onClose={() => setProductModalOpen(false)} />
        )}

        {showAddCustomerModal && (
          <AddCustomerModal onClose={() => setAddShowCustomerModal(false)} />
        )}
        {discountModal && (
          <DiscountModal
            product={activeDiscountProduct}
            manualDiscountValue={manualDiscountValue}
            setManualDiscountValue={setManualDiscountValue}
            setDiscountModal={setDiscountModal}
            handleSetDiscount={handleSetDiscount}
          />
        )}

        {showSellerModal && (
          <AddSellerModal
            onClose={() => setShowSellerModal(false)}
            onSave={(d) => addSeller(d)}
          />
        )}

        {showPromoModal && (
          <AddPromotionModal
            onClose={() => setShowPromoModal(false)}
            onSave={(d) => addPromo(d)}
          />
        )}
      </>
    </div>
  );
}
