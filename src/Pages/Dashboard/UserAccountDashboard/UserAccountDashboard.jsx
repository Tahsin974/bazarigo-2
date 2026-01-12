import React, { useEffect, useState } from "react";

import Overview from "./components/OverView/OverView";
import Cart from "./components/Cart/Cart";
import Returns from "./components/Returns/Returns";

import AccountSettings from "./components/AccountSettings/AccountSettings";
import Drawer from "../../../components/Drawer/Drawer";
import Sidebar from "../../../components/Sidebar/Sidebar";

import MyProfileView from "../../../components/MyProfileView/MyProfileView";
import Wishlist from "./components/Wishlist/Wishlist";
import { useQuery } from "@tanstack/react-query";

import MessagesView from "../../../components/MessagesView/MessagesView";

import useAuth from "../../../Utils/Hooks/useAuth";
import useCart from "../../../Utils/Hooks/useCart";
import MessageModal from "../../../components/Modals/MessageModal/MessageModal";
import Orders from "./components/Orders/Orders";
import NotificationsView from "../../../components/NotificationsView/NotificationsView";
import useMessages from "../../../Utils/Hooks/useMessages";
import useSuperAdmin from "../../../Utils/Hooks/useSuperAdmin";
import {
  Heart,
  Home,
  RotateCcw,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import useAxiosSecure from "../../../Utils/Hooks/useAxiosSecure";
import useNotifications from "../../../Utils/Hooks/useNotifications";
import { useLocation } from "react-router";

export default function UserAccountDashboard() {
  const axiosSecure = useAxiosSecure();
  // Open/Close Menu
  // User

  const navItems = [
    { label: "Overview", icon: <Home size={18} /> },
    { label: "Orders", icon: <ShoppingCart size={18} /> },
    { label: "Cart", icon: <ShoppingBag size={18} /> },
    { label: "Wishlist", icon: <Heart size={18} /> },
    { label: "Returns", icon: <RotateCcw size={18} /> },

    { label: "Settings", icon: <Settings size={18} /> },
  ];

  const { user } = useAuth();
  const sessionKey = `activeMenu_${user?.id}`;
  const location = useLocation();
  const [active, setActive] = useState(() => {
    if (location?.state) {
      return location.state;
    }
    if (window.location.pathname.includes("/dashboard")) {
      return sessionStorage.getItem(sessionKey) || "Overview";
    } else {
      return "Overview";
    }
  });

  const { data: followingLists = [], refetch: refetchFollowingList } = useQuery(
    {
      queryKey: ["followingLists", user?.id],
      queryFn: async () => {
        const res = await axiosSecure.get(`/following/${user.id}`);

        return res.data.sellers;
      },
      enabled: !!user?.id,
    }
  );

  const { notifications } = useNotifications();

  const { myMessages } = useMessages();

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const { bazarigo } = useSuperAdmin();

  // Orders
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user.email}`);
      return res.data.orders;
    },
  });

  const { data: wishlists = [], refetch: refetchWishLists } = useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
      return res.data.wishlists;
    },
  });

  const { carts } = useCart();
  const { data: returnRequests = [], refetch: refetchReturnRequests } =
    useQuery({
      queryKey: ["return-requests-user"],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/return-requests-user/${user?.email}`
        );
        return res.data.returnRequests;
      },
    });

  const openMessageModal = (user) => {
    setActiveMessage(user);
    setMessageModalOpen(true);
  };

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  useEffect(() => {
    if (window.location.pathname.includes("/dashboard")) {
      sessionStorage.setItem(sessionKey, active);
    }
  }, [active, sessionKey]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Side Bar */}

      <div className="hidden lg:flex">
        <Sidebar active={active} setActive={setActive} items={navItems} />
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        {/* Top Bar */}
        <Drawer
          user={user}
          activeTab={active}
          setActiveTab={setActive}
          cart={carts}
          messages={myMessages}
          items={navItems}
        >
          <main className="xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3 overflow-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Left: Page Title */}
              <h1 className="xl:text-xl lg:text-xl md:text-xl sm:text-lg font-bold order-1 lg:order-1 flex items-center gap-2">
                <span className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
                  {active}
                </span>
              </h1>

              {/* Right: Buttons + Admin */}
              <div className="flex flex-wrap items-center gap-3 order-2 lg:order-2">
                {active === "Messages" && (
                  <button
                    onClick={() => openMessageModal(bazarigo)}
                    className="btn border-none rounded shadow bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] text-white sm:text-base text-[14px]"
                  >
                    Chat with Bazarigo
                  </button>
                )}
              </div>
            </div>
            {/* Overview */}
            <Overview
              orders={orders}
              cart={carts}
              activeTab={active}
              unreadCount={unreadCount}
              followingLists={followingLists}
              refetch={refetchFollowingList}
            />
            {/* Orders */}
            <Orders
              orders={orders}
              refetch={refetchOrders}
              activeTab={active}
            />
            {/* Cart */}
            <Cart activeTab={active} />
            {/* Wishlist */}
            <Wishlist
              activeTab={active}
              wishlist={wishlists}
              refetch={refetchWishLists}
            />

            {/* Returns */}
            <Returns
              returnRequests={returnRequests}
              activeTab={active}
              refetch={refetchReturnRequests}
            />

            {/* Notifications */}
            <NotificationsView activeTab={active} setActiveTab={setActive} />

            {/* Messages */}
            {active === "Messages" && (
              <MessagesView
                messages={myMessages}
                openMessageModal={openMessageModal}
              />
            )}
            {/*Account Settings */}
            <AccountSettings activeTab={active} />
            {/* My Profile */}
            <MyProfileView user={user} activeTab={active} />
          </main>
        </Drawer>
      </div>

      {messageModalOpen && (
        <MessageModal
          onClose={() => setMessageModalOpen(false)}
          user={activeMessage}
          senderId={user.id}
          senderRole={user.role}
        />
      )}
    </div>
  );
}
