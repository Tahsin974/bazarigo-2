import { useEffect, useMemo, useRef, useState } from "react";

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

import useAxiosSecure from "../../../Utils/Hooks/useAxiosSecure";
import useAuth from "../../../Utils/Hooks/useAuth";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import useProducts from "../../../Utils/Hooks/useProducts";
import useOrders from "../../../Utils/Hooks/useOrders";
import useSellers from "../../../Utils/Hooks/useSellers";
import usePayments from "../../../Utils/Hooks/usePayments";
import useFlashSaleProducts from "../../../Utils/Hooks/useFlashSaleProducts";
import usePromotions from "../../../Utils/Hooks/usePromotions";
import useUsers from "../../../Utils/Hooks/useUsers";
import OrderModal from "../../../components/Modals/OrderModal/OrderModal";
import ImageGalleryModal from "../../../components/Modals/ImageGalleryModal/ImageGalleryModal";
import PreviewModal from "../../../components/Modals/PreviewModal/PreviewModal";
import SellerModal from "../../../components/Modals/SellerModal/SellerModal";
import CustomerModal from "../../../components/Modals/CustomerModal/CustomerModal";
import EditProductModal from "../../../components/Modals/EditProductModal/EditProductModal";
import ProductModal from "../../../components/Modals/ProductModal/ProductModal";
import MessageModal from "../../../components/Modals/MessageModal/MessageModal";

import AddCustomerModal from "../../../components/Modals/AddCustomerModal/AddCustomerModal";
import DiscountModal from "../../../components/Modals/DiscountModal/DiscountModal";
import AddSellerModal from "../../../components/Modals/AddSellerModal/AddSellerModal";
import AddPromotionModal from "../../../components/Modals/AddPromotionModal/AddPromotionModal";
import Swal from "sweetalert2";
import Drawer from "../../../components/Drawer/Drawer";
import FlashSaleView from "./views/FlashSaleView";
import ZoneView from "./views/ZoneView";
import NotificationsView from "../../../components/NotificationsView/NotificationsView";
import MessagesView from "../../../components/MessagesView/MessagesView";
import { useLocation } from "react-router";
import useMessages from "../../../Utils/Hooks/useMessages";
import InventoryView from "./views/InventoryView";
import AddMemberModal from "../../../components/Modals/AddMemberModal/AddMemberModal";
import PaymentModal from "../../../components/Modals/PaymentModal/PaymentModal";
import {
  BarChart3,
  Boxes,
  CreditCard,
  Gift,
  Home,
  Map,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  Zap,
} from "lucide-react";

export default function AdminPanelDashboard() {
  const location = useLocation();

  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const [active, setActive] = useState(location?.state || "Dashboard");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selected, setSelected] = useState([]);

  // Datas (Products,Sellers,Orders,FlashSale,Payments,Promotions,Coverage Areas,Returns,Customers,user)

  const { user } = useAuth();
  const navItems = [
    { label: "Dashboard", icon: <Home size={18} /> },
    { label: "Products", icon: <Package size={18} /> },
    { label: "Inventory", icon: <Boxes size={18} /> },
    { label: "FlashSale", icon: <Zap size={18} /> },
    { label: "Orders", icon: <ShoppingCart size={18} /> },
    { label: "Customers", icon: <Users size={18} /> },
    { label: "Sellers", icon: <Store size={18} /> },
    { label: "Payments", icon: <CreditCard size={18} /> },
    { label: "Promotions", icon: <Gift size={18} /> },
    { label: "Reports", icon: <BarChart3 size={18} /> },
    { label: "Coverage Areas", icon: <Map size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
  ];

  const navOptions =
    user.role !== "moderator"
      ? navItems
      : navItems.filter(
          (item) => item.label !== "Payments" // moderator থেকে Payments বাদ
        );

  // const navOptions =
  //   user.role !== "moderator"
  //     ? [
  //         "Dashboard",
  //         "Products",
  //         "Inventory",
  //         "FlashSale",
  //         "Orders",
  //         "Customers",
  //         "Sellers",
  //         "Payments",
  //         "Promotions",
  //         "Reports",
  //         "Coverage Areas",

  //         "Settings",
  //       ]
  //     : [
  //         "Dashboard",
  //         "Products",
  //         "Inventory",
  //         "FlashSale",
  //         "Orders",
  //         "Customers",
  //         "Sellers",

  //         "Promotions",
  //         "Reports",
  //         "Coverage Areas",

  //         "Settings",
  //       ];
  // , refetch: refetchMessages
  const { myMessages } = useMessages();

  const { data: admins = [], refetch: refetchAdmins } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admins");
      return { admins: res.data.admins, moderators: res.data.moderators };
    },
  });
  const { products, refetch: refetchProducts } = useProducts();
  const { orders, refetch: refetchOrders } = useOrders();

  const { sellers, refetch: refetchSellers } = useSellers();

  const { payments, refetch: refetchPayments } = usePayments();
  const { data: sellerPayments = [], refetch: refetchSellerPayments } =
    useQuery({
      queryKey: ["seller-payments"],
      queryFn: async () => {
        const res = await axiosSecure.get(`/seller-payments`);
        return res.data.payments;
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

  const { data: coverageAreas = [], refetch: refetchAreas } = useQuery({
    queryKey: ["postalZones"],
    queryFn: async () => {
      const res = await axiosPublic.get("/postal-zones");

      return res.data.postal_zones;
    },
  });
  const { data: returnRequests = [], refetch: refetchReturnRequests } =
    useQuery({
      queryKey: ["ReturnRequests"],
      queryFn: async () => {
        const res = await axiosPublic.get("/return-requests");

        return res.data.returnRequests;
      },
    });

  const { flashSaleProducts, refetch: refetchFlashSale } =
    useFlashSaleProducts();
  const { promotions, refetch: refetchPromotions } = usePromotions();
  const { data: returns = [], refetch: refetchReturnOrders } = useQuery({
    queryKey: ["returns"],
    queryFn: async () => {
      const res = await axiosPublic.get("/return-orders");

      return res.data.returnOrders;
    },
  });

  const { users: customers, refetch: refetchCustomers } = useUsers();

  // Shared states for search/sort
  const [productSearch, setProductSearch] = useState("");
  const [postalZoneSearch, setPostalZoneSearch] = useState("");
  const [productSort, setProductSort] = useState("name");
  const [orderSearch, setOrderSearch] = useState("");
  const [returnOrderSearch, setReturnOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [sellerPaymentsSearch, setSellerPaymentsSearch] = useState("");
  const [promoSearch, setPromoSearch] = useState("");

  // inventory filters/pagination
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventorySort, setInventorySort] = useState("name");
  const [inventoryPage, setInventoryPage] = useState(1);

  // Pagination states
  const [orderPage, setOrderPage] = useState(1);
  const [returnOrderPage, setReturnOrderPage] = useState(1);
  const [customerPage, setCustomerPage] = useState(1);
  const [sellerPage, setSellerPage] = useState(1);
  const [paymentPage, setPaymentPage] = useState(1);
  const [sellerPaymentsPage, setSellerPaymentsPage] = useState(1);
  const [promoPage, setPromoPage] = useState(1);
  const [productPage, setProductPage] = useState(1);
  const [postalZonePage, setPostalZonePage] = useState(1);
  const [flashSaleProductPage, setFlashSaleProductPage] = useState(1);
  const [returnRequestsPage, setReturnRequestsPage] = useState(1);

  const currentPageSize = 6;

  // Modal controls

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState(null);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [activeCustomer, setActiveCustomer] = useState(null);

  const [activeOrder, setActiveOrder] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(null);
  const [activeReturnRequest, setActiveReturnRequest] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(null);
  const [showAddCustomerModal, setAddShowCustomerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // FlashSale

  const [duration, setDuration] = useState(0);
  const [discountModal, setDiscountModal] = useState(false);
  const [manualDiscount, setManualDiscount] = useState({});
  const [manualDiscountValue, setManualDiscountValue] = useState("");
  const [activeDiscountProduct, setActiveDiscountProduct] = useState(null);

  // File input ref for bulk upload
  const fileRef = useRef(null);

  useEffect(() => {
    if (selected.length !== 0) {
      setSelected([]);
    }
  }, [active, products, orders, customers, coverageAreas, sellers]);

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
        category: product.category ?? "",
        subcategory: product.subcategory ?? "",
        description: product.description ?? "",
        stock: product.stock ?? 0,
        brand: product.brand ?? "No Brand",
        weight: product.weight ?? 1,
        images: (product.images || []).join(";"),
        extras: JSON.stringify(product.extras || {}, null, 2),
      }));
    }

    if (active === "Orders")
      rows = orders.map(({ items, ...rest }) => ({
        ...rest,
        items_count: items.length,
      }));

    if (active === "Customers") rows = customers;
    if (active === "Sellers") rows = sellers;
    if (active === "Payments") {
      // Export payments.xlsx
      if (payments.length) {
        const wb1 = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(payments);
        ws1["!cols"] = Object.keys(payments[0] || {}).map((key) => ({
          wch: Math.max(key.length, 20),
        }));
        XLSX.utils.book_append_sheet(wb1, ws1, "Payments"); // fresh workbook, কোনো conflict নেই
        XLSX.writeFile(wb1, "Payments_export.xlsx");
      }

      // Export sellerPayments.xlsx
      if (sellerPayments.length) {
        const wb2 = XLSX.utils.book_new(); // fresh workbook
        const ws2 = XLSX.utils.json_to_sheet(sellerPayments);
        ws2["!cols"] = Object.keys(sellerPayments[0] || {}).map((key) => ({
          wch: Math.max(key.length, 20),
        }));
        XLSX.utils.book_append_sheet(wb2, ws2, "SellerPayments");
        XLSX.writeFile(wb2, "SellerPayments_export.xlsx");
      }

      return;
    }

    if (active === "Promotions") rows = promotions.map((p) => ({ ...p }));
    if (active === "Coverage Areas")
      rows = coverageAreas.map((zone) => ({
        division: zone.division,
        district: zone.district,
        thana: zone.thana,
        place: zone.place,
        postal_code: zone.postal_code,
        latitude: zone.latitude,
        longitude: zone.longitude,
        isRemote: zone.is_remote ? "Hard To Reach" : "Normal",
      }));

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
    if (active === "Products" || active === "FlashSale") {
      const id = products.map((p) => p.id);
      setSelected(selected.length === id.length ? [] : id);
    }
    if (active === "Orders") {
      const id = orders.map((o) => o.order_id);
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
    if (active === "Coverage Areas") {
      const id = coverageAreas.map((c) => c.id);
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
        extras: item.extras ? JSON.stringify(item.extras) : {},
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
  const handleBulkUploadPostalZones = async () => {
    const file = fileRef.current.files[0]; // file picker থেকে ফাইল

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      // Convert to postal zone objects
      const postalZones = jsonData.map((item) => ({
        division: item.division,
        district: item.district,
        thana: item.thana,
        place: item.place,
        postal_code: item.postal_code,
        latitude: Number(item.latitude || 0),
        longitude: Number(item.longitude || 0),
        is_remote:
          item.is_remote === true || item.is_remote === "true" || false,
      }));

      console.log(postalZones);

      // Send to backend
      const res = await axiosPublic.post("/postal-zones/bulk", postalZones);

      if (res.data.createdCount > 0) {
        Swal.fire({
          icon: "success",
          title: `${res.data.createdCount} Postal Zones Created Successfully`,
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });

        fileRef.current.value = null; // reset input
        refetchAreas();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops! Try Again",
          showConfirmButton: false,
          toast: true,
          position: "top",
          timer: 1500,
        });
      }
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
  const openImageGalleryModal = (returnRequest) => {
    setImageModalOpen(true);
    setActiveReturnRequest(returnRequest);
  };

  const openSellerModal = (seller) => {
    setSellerModalOpen(true);
    setActiveSeller(seller);
  };

  const openPaymentModal = (seller) => {
    setSelectedSeller(seller);
    setPaymentModalOpen(true);
  };
  const openCustomerModal = (customer) => {
    setCustomerModalOpen(true);
    setActiveCustomer(customer);
  };

  const openDiscountModal = (product) => {
    setManualDiscount({});
    setActiveDiscountProduct(product);
    setDiscountModal(true);
  };
  const openMessageModal = (user) => {
    setActiveMessage(user);
    setMessageModalOpen(true);
  };

  const handleSetDiscount = (product) => {
    setManualDiscount({
      id: product.id,
      discount: Number(manualDiscountValue),
    });
    setDiscountModal(false);
  };
  // 📦Products Filtering & Sorting
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
    data = data.sort((a, b) => {
      if (productSort === "stock") return (b.stock || 0) - (a.stock || 0);
      if (productSort === "price")
        return (
          (b.sale_price > 0 ? b.sale_price : b.regular_price) -
          (a.sale_price > 0 ? a.sale_price : a.regular_price)
        );
      if (productSort === "rating") {
        // Compute b's rating
        const bRating =
          b.rating > 0
            ? b.rating
            : b.reviews && b.reviews.length > 0
            ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
            : 0;

        // Compute a's rating
        const aRating =
          a.rating > 0
            ? a.rating
            : a.reviews && a.reviews.length > 0
            ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
            : 0;

        return bRating - aRating; // High → Low
      } else {
        (a.product_name || "").localeCompare(b.product_name || "");
      }
    });

    return data;
  }, [products, productSearch, productSort]);

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

  // 📦 Orders Filtering & Sorting
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

  // 📦 Return Orders Filtering & Sorting
  const filteredReturnOrders = useMemo(() => {
    let data = [...returns];
    if (returnOrderSearch) {
      const q = returnOrderSearch.toLowerCase();
      data = data.filter(
        (o) =>
          (o.order_id || "").toLowerCase().includes(q) ||
          (o.customer_email || "").toLowerCase().includes(q) ||
          (o.customer_name || "").toLowerCase().includes(q)
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
  const filteredSellerPayments = useMemo(() => {
    let data = [...sellerPayments];
    if (sellerPaymentsSearch) {
      const q = sellerPaymentsSearch.toLowerCase();
      data = data.filter(
        (p) =>
          (p.id || "").toLowerCase().includes(q) ||
          (p.method || "").toLowerCase().includes(q) ||
          (p.status || "").toLowerCase().includes(q)
      );
    }

    return data;
  }, [sellerPayments, sellerPaymentsSearch]);

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

  const paginatedReturnRequests = returnRequests.slice(
    (returnRequestsPage - 1) * currentPageSize,
    returnRequestsPage * currentPageSize
  );
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * currentPageSize,
    productPage * currentPageSize
  );
  const paginatedOrders = filteredOrders.slice(
    (orderPage - 1) * currentPageSize,
    orderPage * currentPageSize
  );
  const paginatedReturnOrders = filteredReturnOrders.slice(
    (returnOrderPage - 1) * currentPageSize,
    returnOrderPage * currentPageSize
  );
  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * currentPageSize,
    customerPage * currentPageSize
  );
  const paginatedSellers = filteredSellers.slice(
    (sellerPage - 1) * currentPageSize,
    sellerPage * currentPageSize
  );
  const paginatedPayments = filteredPayments.slice(
    (paymentPage - 1) * currentPageSize,
    paymentPage * currentPageSize
  );
  const paginatedSellerPayments = filteredSellerPayments.slice(
    (sellerPaymentsPage - 1) * currentPageSize,
    sellerPaymentsPage * currentPageSize
  );
  const paginatedPromotions = filteredPromotions.slice(
    (promoPage - 1) * 6,
    promoPage * 6
  );

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
              items={navOptions}
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
              messages={myMessages}
              items={navOptions}
            >
              <main className="xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  {/* Left: Page Title */}
                  <h1 className="xl:text-2xl lg:text-2xl md:text-2xl sm:text-xl text-lg font-bold order-1 lg:order-1">
                    {active}
                  </h1>

                  {/* Right: Buttons + Admin */}
                  <div className="flex flex-wrap items-center gap-3 order-2 lg:order-2">
                    {active !== "My Account" &&
                      active !== "Dashboard" &&
                      active !== "Reports" &&
                      active !== "Settings" &&
                      active !== "FlashSale" &&
                      active !== "Notifications" && (
                        <>
                          {user.role !== "moderator" &&
                            active === "Products" && (
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

                          {user.role !== "moderator" &&
                            active === "Coverage Areas" && (
                              <>
                                <input
                                  ref={fileRef}
                                  type="file"
                                  accept=".xlsx, .xls"
                                  className="hidden"
                                  onChange={handleBulkUploadPostalZones}
                                />
                                <button
                                  onClick={() =>
                                    fileRef.current && fileRef.current.click()
                                  }
                                  className="btn border-none rounded shadow bg-[#00C853] hover:bg-[#00B34A] text-white sm:text-base text-[14px]"
                                >
                                  Bulk Upload Zones
                                </button>
                                <ExportBtn exportBtnHandler={handleExport} />
                              </>
                            )}
                          {active === "Payments" && (
                            <ExportBtn exportBtnHandler={handleExport} />
                          )}

                          {active === "Messages" &&
                            user.role !== "super admin" && (
                              <button className="btn border-none rounded shadow bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white sm:text-base text-[14px]">
                                Chat with Bazarigo
                              </button>
                            )}
                        </>
                      )}
                  </div>
                </div>

                <div className="p-4">
                  {active === "Dashboard" && (
                    <DashboardView
                      products={products}
                      orders={orders}
                      payments={payments}
                      paginatedReturnRequests={paginatedReturnRequests}
                      returnRequests={returnRequests}
                      openImageGalleryModal={openImageGalleryModal}
                      setReturnRequestsPage={setReturnRequestsPage}
                      returnRequestsPage={returnRequestsPage}
                      refetch={refetchReturnRequests}
                      returnRequestsPageSize={currentPageSize}
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
                      allSelected={
                        selected.length === products.length &&
                        products.length > 0
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
                  )}

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
                  {active === "FlashSale" && (
                    <FlashSaleView
                      products={products}
                      selected={selected}
                      setSelected={setSelected}
                      toggleSelect={toggleSelect}
                      allSelected={
                        selected.length === products.length &&
                        products.length > 0
                      }
                      refetchProducts={refetchProducts}
                      startTime={startTime}
                      setStartTime={setStartTime}
                      endTime={endTime}
                      setEndTime={setEndTime}
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
                      flashSaleProducts={flashSaleProducts}
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
                      refetch={refetchFlashSale}
                    />
                  )}

                  {active === "Orders" && (
                    <OrdersView
                      orders={orders}
                      returns={returns}
                      openOrderModal={openOrderModal}
                      selected={selected}
                      toggleSelect={toggleSelect}
                      refetch={refetchOrders}
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
                  )}

                  {active === "Customers" && (
                    <CustomersView
                      customers={customers}
                      selected={selected}
                      refetch={refetchCustomers}
                      toggleSelect={toggleSelect}
                      onAdd={() => setAddShowCustomerModal(true)}
                      allSelected={
                        selected.length === customers.length &&
                        customers.length > 0
                      }
                      openCustomerModal={openCustomerModal}
                      toggleSelectAll={selectAll}
                      customerPage={customerPage}
                      setCustomerPage={setCustomerPage}
                      customerPageSize={currentPageSize}
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
                      openPaymentModal={openPaymentModal}
                      toggleSelect={toggleSelect}
                      onAdd={() => setShowSellerModal(true)}
                      allSelected={
                        selected.length === sellers.length && sellers.length > 0
                      }
                      refetch={refetchSellers}
                      openSellerModal={openSellerModal}
                      toggleSelectAll={selectAll}
                      sellerPage={sellerPage}
                      setSellerPage={setSellerPage}
                      sellerPageSize={currentPageSize}
                      paginatedSellers={paginatedSellers}
                      filteredSellers={filteredSellers}
                      sellerSearch={sellerSearch}
                      setSellerSearch={setSellerSearch}
                    />
                  )}

                  {active === "Payments" && (
                    <PaymentsView
                      payments={payments}
                      sellerPayments={sellerPayments}
                      refetch={refetchPayments}
                      paymentPage={paymentPage}
                      sellerPaymentsPage={sellerPaymentsPage}
                      setPaymentPage={setPaymentPage}
                      setSellerPaymentsPage={setSellerPaymentsPage}
                      paymentSearch={paymentSearch}
                      sellerPaymentsSearch={sellerPaymentsSearch}
                      setSellerPaymentsSearch={setSellerPaymentsSearch}
                      setPaymentSearch={setPaymentSearch}
                      paymentPageSize={currentPageSize}
                      filteredPayments={filteredPayments}
                      filteredSellerPayments={filteredSellerPayments}
                      paginatedPayments={paginatedPayments}
                      paginatedSellerPayments={paginatedSellerPayments}
                    />
                  )}

                  {active === "Promotions" && (
                    <PromotionsView
                      promotions={promotions}
                      onAdd={() => setShowPromoModal(true)}
                      refetch={refetchPromotions}
                      promoPage={promoPage}
                      setPromoPage={setPromoPage}
                      promoSearch={promoSearch}
                      setPromoSearch={setPromoSearch}
                      promoPageSize={currentPageSize}
                      filteredPromotions={filteredPromotions}
                      paginatedPromotions={paginatedPromotions}
                    />
                  )}
                  <NotificationsView
                    activeTab={active}
                    setActiveTab={setActive}
                  />

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
                      postalZonePageSize={currentPageSize}
                      coverageAreas={coverageAreas}
                      refetch={refetchAreas}
                      selected={selected}
                      allSelected={
                        selected.length === coverageAreas.length &&
                        coverageAreas.length > 0
                      }
                      toggleSelectAll={selectAll}
                      toggleSelect={toggleSelect}
                    />
                  )}
                  {active === "Messages" && (
                    <MessagesView
                      messages={myMessages}
                      openMessageModal={openMessageModal}
                    />
                  )}

                  {active === "My Account" && (
                    <MyProfileView user={user} activeTab={active} />
                  )}
                  {active === "Settings" && (
                    <SettingsView
                      setShowAddUserModal={setShowAddMemberModal}
                      admins={admins}
                      refetchAdmins={refetchAdmins}
                    />
                  )}
                </div>
              </main>
            </Drawer>
          </div>
        </div>

        {orderModalOpen && (
          <OrderModal
            order={activeOrder}
            onClose={() => setOrderModalOpen(false)}
            refetch={refetchOrders}
            refetchReturnOrders={refetchReturnOrders}
          />
        )}
        {imageModalOpen && (
          <ImageGalleryModal
            images={activeReturnRequest}
            onClose={() => setImageModalOpen(false)}
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
            refetch={refetchProducts}
          />
        )}

        {productModalOpen && (
          <ProductModal
            onClose={() => setProductModalOpen(false)}
            refetch={refetchProducts}
          />
        )}

        {messageModalOpen && (
          <MessageModal
            onClose={() => setMessageModalOpen(false)}
            user={activeMessage}
            senderId={user.id}
            senderRole={user.role}
          />
        )}
        {showAddMemberModal && (
          <AddMemberModal
            onClose={() => setShowAddMemberModal(false)}
            refetch={refetchAdmins}
          />
        )}

        {showAddCustomerModal && (
          <AddCustomerModal onClose={() => setAddShowCustomerModal(false)} />
        )}
        {discountModal && (
          <DiscountModal
            product={activeDiscountProduct}
            manualDiscountValue={manualDiscountValue}
            setManualDiscountValue={setManualDiscountValue}
            handleSetDiscount={handleSetDiscount}
            onClose={() => {
              setDiscountModal(false);
              setManualDiscountValue("");
            }}
          />
        )}

        {showSellerModal && (
          <AddSellerModal
            onClose={() => setShowSellerModal(false)}
            refetch={refetchSellers}
          />
        )}

        {showPromoModal && (
          <AddPromotionModal
            refetch={refetchPromotions}
            onClose={() => setShowPromoModal(false)}
          />
        )}
        {isPaymentModalOpen && (
          <PaymentModal
            seller={selectedSeller}
            onClose={() => setPaymentModalOpen(false)}
            refetch={refetchSellerPayments}
          />
        )}
      </>
    </div>
  );
}
