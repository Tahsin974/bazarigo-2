import React, { useState } from "react";

import Overview from "./components/OverView/OverView";
import Cart from "./components/Cart/Cart";
import Returns from "./components/Returns/Returns";

import AccountSettings from "./components/AccountSettings/AccountSettings";
import Drawer from "../../../components/Drawer/Drawer";
import Sidebar from "../../../components/Sidebar/Sidebar";

import MyProfileView from "../../../components/MyProfileView/MyProfileView";
import Wishlist from "./components/Wishlist/Wishlist";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Utils/Hooks/useAxiosPublic";
import MessagesView from "../../../components/MessagesView/MessagesView";

import useAuth from "../../../Utils/Hooks/useAuth";
import useCart from "../../../Utils/Hooks/useCart";
import MessageModal from "../../../components/Modals/MessageModal/MessageModal";
import Orders from "./components/Orders/Orders";
import NotificationsView from "../../../components/NotificationsView/NotificationsView";
import { useLocation } from "react-router";
import useMessages from "../../../Utils/Hooks/useMessages";
import useSuperAdmin from "../../../Utils/Hooks/useSuperAdmin";
import {
  Heart,
  Home,
  RotateCcw,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Undo2,
} from "lucide-react";

export default function UserAccountDashboard() {
  const location = useLocation();
  const axiosPublic = useAxiosPublic();
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

  const { data: followingLists = [], refetch: refetchFollowingList } = useQuery(
    {
      queryKey: ["followingList"],
      queryFn: async () => {
        const res = await axiosPublic(`/following/${user.id}`);
        return res.data.sellers;
      },
    }
  );
  const { myMessages } = useMessages();

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const { bazarigo } = useSuperAdmin();
  // Orders
  const { data: orders = [], refetch: refetchOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/orders/${user.email}`);
      return res.data.orders;
    },
  });

  const { data: wishlists = [], refetch: refetchWishLists } = useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/wishlist?email=${user.email}`);
      return res.data.wishlists;
    },
  });
  const { carts } = useCart();
  const { data: returnRequests = [], refetch: refetchReturnRequests } =
    useQuery({
      queryKey: ["returnRequests"],
      queryFn: async () => {
        const res = await axiosPublic.get(`/return-requests/${user.email}`);
        return res.data.returnRequests;
      },
    });

  const [activeTab, setActiveTab] = useState(location?.state || "Overview");

  const openMessageModal = (user) => {
    setActiveMessage(user);
    setMessageModalOpen(true);
  };
  console.log(bazarigo);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Side Bar */}

      <div className="hidden lg:flex">
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          orders={orders}
          cart={carts}
          wishlist={wishlists}
          items={navItems}
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
          orders={orders}
          cart={carts}
          wishlist={wishlists}
          messages={myMessages}
          items={navItems}
        >
          <main className="xl:p-6 lg:p-6 md:p-6 sm:p-4 p-3 overflow-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              {/* Left: Page Title */}
              <h1 className="xl:text-xl lg:text-xl md:text-xl sm:text-lg font-bold order-1 lg:order-1 flex items-center gap-2">
                <span className="bg-gradient-to-r from-[#FF0055] to-[#FF7B7B] bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient">
                  {activeTab}
                </span>
              </h1>

              {/* Right: Buttons + Admin */}
              <div className="flex flex-wrap items-center gap-3 order-2 lg:order-2">
                {activeTab === "Messages" && (
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
              activeTab={activeTab}
              followingLists={followingLists}
              refetch={refetchFollowingList}
            />
            {/* Orders */}
            <Orders
              orders={orders}
              refetch={refetchOrders}
              activeTab={activeTab}
            />
            {/* Cart */}
            <Cart activeTab={activeTab} />
            {/* Wishlist */}
            <Wishlist
              activeTab={activeTab}
              wishlist={wishlists}
              refetch={refetchWishLists}
            />

            {/* Returns */}
            <Returns
              returnRequests={returnRequests}
              activeTab={activeTab}
              refetch={refetchReturnRequests}
            />

            {/* Notifications */}
            <NotificationsView
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Messages */}
            {activeTab === "Messages" && (
              <MessagesView
                messages={myMessages}
                openMessageModal={openMessageModal}
              />
            )}
            {/*Account Settings */}
            <AccountSettings activeTab={activeTab} />
            {/* My Profile */}
            <MyProfileView user={user} activeTab={activeTab} />
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
