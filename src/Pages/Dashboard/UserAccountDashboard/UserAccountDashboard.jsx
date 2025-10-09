import React, { useEffect, useState } from "react";

import Overview from "./components/OverView/OverView";
import Orders from "./components/Orders/Orders";
import Cart from "./components/Cart/Cart";
import Payments from "./components/Payments/Payments";
import Returns from "./components/Returns/Returns";
import Addresses from "./components/Addresses/Addresses";
import Notifications from "./components/Notifications/Notifications";
import AccountSettings from "./components/AccountSettings/AccountSettings";

import Drawer from "../../../components/Drawer/Drawer";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EditProfileModal from "../../../components/EditProfileModal/EditProfileModal";
import MyProfileView from "../../../components/MyProfileView/MyProfileView";

export default function UserAccountDashboard() {
  // Open/Close Menu
  // User
  const [user, setUser] = useState({
    name: "রাহিম উদ্দিন",
    email: "rahim@example.com",
    phone: "01712345678",
    avatar: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
  });
  // Cart
  const [cart, setCart] = useState([
    {
      id: "c1",
      title: "Classic Cotton Shirt",
      price: 850,
      qty: 2,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
    },
    {
      id: "c2",
      title: "Bluetooth Speaker",
      price: 2000,
      qty: 1,
      img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
    },
  ]);

  // Payments

  // Orders
  const [orders, setOrders] = useState([
    {
      id: "o1",
      date: "2025-09-01",
      status: "Shipped",
      steps: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
      currentStep: 2,
      products: [
        {
          id: "p1",
          name: "Wireless Headphones",
          price: 3000,
          img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
        },
        {
          id: "p2",
          name: "Smart Watch",
          price: 4500,
          img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
        },
      ],
    },
    {
      id: "o2",
      date: "2025-08-15",
      status: "Delivered",
      steps: ["Processing", "Shipped", "Out for Delivery", "Delivered"],
      currentStep: 4,
      products: [
        {
          id: "p3",
          name: "Running Shoes",
          price: 2500,
          img: "https://placehold.co/400x400/FF0055/ffffff?text=Wristwatch",
        },
      ],
    },
  ]);

  // Addresses
  const [addresses, setAddresses] = useState([
    {
      id: "addr1",
      type: "Home",
      details: "House 12, Road 4, Dhanmondi, Dhaka",
      primary: true,
    },
  ]);
  const [newAddress, setNewAddress] = useState({ type: "Home", details: "" });
  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your order #o1 has been shipped.",
      category: "Orders",
      read: false,
    },
    {
      id: 2,
      message: "New payment method added successfully.",
      category: "Payments",
      read: true,
    },
    {
      id: 3,
      message: "Flash sale starts tomorrow!",
      category: "Promotions",
      read: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState("Overview");
  // Edit profile modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  // Payments
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "pm1", type: "card", label: "Visa •••• 4242", primary: true },
  ]);
  const [newPayment, setNewPayment] = useState({
    method: "card",
    cardNumber: "",
    brand: "",
    walletProvider: "",
    walletPhone: "",
    makePrimary: false,
  });

  // Returns
  const [returnRequests, setReturnRequests] = useState([]);
  const [prefillOrderId, setPrefillOrderId] = useState("");

  // Settings
  const [settings, setSettings] = useState({
    language: "English",
    notifications: true,
    twoFactor: false,
    oldPassword: "",
    password: "",
  });

  // Derived
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // ----- Cart helpers -----
  const updateCartQty = (id, qty) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: qty > 0 ? qty : 1 } : i))
    );
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  // ----- Payments helpers -----
  function addPayment(e) {
    e && e.preventDefault();
    if (newPayment.method === "card") {
      if (!newPayment.cardNumber || newPayment.cardNumber.trim().length < 4)
        return alert("Enter a valid card number (demo requires min 4 digits)");
      const label = `${
        newPayment.brand || "Card"
      } •••• ${newPayment.cardNumber.slice(-4)}`;
      setPaymentMethods((prev) => [
        ...prev.map((p) => ({ ...p, primary: false })),
        {
          id: `card_${Date.now()}`,
          type: "card",
          label,
          primary: !!newPayment.makePrimary,
        },
      ]);
    } else {
      if (!newPayment.walletProvider || !newPayment.walletPhone)
        return alert("Select wallet provider and enter phone");
      const label = `${newPayment.walletProvider} • ${newPayment.walletPhone}`;
      setPaymentMethods((prev) => [
        ...prev.map((p) => ({ ...p, primary: false })),
        {
          id: `wallet_${Date.now()}`,
          type: "wallet",
          label,
          primary: !!newPayment.makePrimary,
        },
      ]);
    }
    setNewPayment({
      method: "card",
      cardNumber: "",
      brand: "",
      walletProvider: "",
      walletPhone: "",
      makePrimary: false,
    });
  }
  const removePayment = (id) =>
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  const setPrimaryPayment = (id) =>
    setPaymentMethods((prev) =>
      prev.map((p) => ({ ...p, primary: p.id === id }))
    );

  // ----- Returns helpers -----
  const addReturnRequest = (orderId, reason, images) => {
    if (!orderId || !reason) return alert("Provide order ID and reason");
    setReturnRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        orderId,
        reason,
        status: "Pending",
        images: images || [],
      },
    ]);
    // clear prefill after submit
    setPrefillOrderId("");
    setActiveTab("returns");
  };
  const updateReturnStatus = (id, status) =>
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  const deleteReturnRequest = (id) =>
    setReturnRequests((prev) => prev.filter((r) => r.id !== id));

  // ----- Addresses helpers -----
  const addAddress = (e) => {
    e && e.preventDefault();
    if (!newAddress.details) return alert("Enter address details");
    setAddresses((prev) => [
      ...prev.map((a) => ({ ...a, primary: false })),
      {
        id: Date.now(),
        type: newAddress.type,
        details: newAddress.details,
        primary: true,
      },
    ]);
    setNewAddress({ type: "Home", details: "" });
  };
  const setPrimaryAddress = (id) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, primary: a.id === id })));
  const removeAddress = (id) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  // ----- Notifications helpers -----
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  // ----- Profile helpers -----
  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: url }));
    }
  };
  const handleProfileSave = (e) => {
    e && e.preventDefault();
    setShowEditProfile(false);
    alert("Profile updated");
  };

  // ----- Settings save -----
  const saveSettings = (e) => {
    e && e.preventDefault();
    alert("Settings saved (demo)");
  };

  // ensure prefill order ID sync when user clicks return in orders
  useEffect(() => {
    if (prefillOrderId) setActiveTab("returns");
  }, [prefillOrderId]);

  // ----- Render -----

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Side Bar */}

      <div className="hidden lg:flex">
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          notifications={notifications}
          orders={orders}
          cart={cart}
          items={[
            "Overview",
            "Orders",
            "Cart",
            "Payments",
            "Returns",
            "Addresses",
            "Notifications",
            "My Account",
            "Settings",
          ]}
        />
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        {/* Top Bar */}
        <Drawer
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          notifications={notifications}
          orders={orders}
          cart={cart}
          items={[
            "Overview",
            "Orders",
            "Cart",
            "Payments",
            "Returns",
            "Addresses",
            "Notifications",
            "My Account",
            "Settings",
          ]}
        >
          <main className="xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3 overflow-auto">
            {/* Overview */}
            <Overview
              orders={orders}
              cart={cart}
              unreadCount={notifications.length}
              activeTab={activeTab}
              cartTotal={cartTotal}
            />
            {/* Orders */}
            <Orders
              orders={orders}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setPrefillOrderId={setPrefillOrderId}
            />
            {/* Cart */}
            <Cart
              cart={cart}
              cartTotal={cartTotal}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              updateCartQty={updateCartQty}
              removeFromCart={removeFromCart}
            />
            {/* Payments */}
            <Payments
              paymentMethods={paymentMethods}
              activeTab={activeTab}
              setPrimaryPayment={setPrimaryPayment}
              removePayment={removePayment}
              addPayment={addPayment}
              newPayment={newPayment}
              setNewPayment={setNewPayment}
            />
            {/* Returns */}
            <Returns
              returnRequests={returnRequests}
              activeTab={activeTab}
              addReturnRequest={addReturnRequest}
              updateReturnStatus={updateReturnStatus}
              deleteReturnRequest={deleteReturnRequest}
              prefillOrderId={prefillOrderId}
            />
            {/* Addresses */}
            <Addresses
              addresses={addresses}
              activeTab={activeTab}
              addAddress={addAddress}
              newAddress={newAddress}
              setNewAddress={setNewAddress}
              removeAddress={removeAddress}
              setPrimaryAddress={setPrimaryAddress}
            />
            {/* Notifications */}
            <Notifications
              notifications={notifications}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              markNotificationRead={markNotificationRead}
            />
            {/*Account Settings */}
            <AccountSettings
              activeTab={activeTab}
              settings={settings}
              setSettings={setSettings}
              saveSettings={saveSettings}
            />
            {/* My Profile */}
            <MyProfileView
              user={user}
              setShowEditProfile={setShowEditProfile}
              activeTab={activeTab}
            />
          </main>
        </Drawer>
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
