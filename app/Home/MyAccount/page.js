"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaBox } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import MyProfile from "@/components/MyAccountDetails/Profile";
import OrderHistory from "@/components/MyAccountDetails/OrderHistory";
import AddressManagement from "@/components/MyAccountDetails/AddressManagement";

export default function MyAccount() {
  const router = useRouter();

  // Tabs state
  const [activeTab, setActiveTab] = useState("profile"); // default
  const menuItems = [
    { id: "profile", label: "My Profile", icon: FaUser },
    { id: "orders", label: "Order History", icon: FaBox },
    { id: "address", label: "Saved Addresses", icon: FaLocationDot },
  ];

  // Safe client-side initialization
  useEffect(() => {
    // Get tab from URL
    const searchParams = new URLSearchParams(window.location.search);
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, []);

  // Update URL when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`/Home/MyAccount?tab=${tabId}`, { shallow: true });
  };

  // Render the right content per tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <MyProfile  />;
      case "orders":
        return <OrderHistory  />;
      case "address":
        return <AddressManagement />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="text-3xl w-full text-center font-bold text-indigo-800 mb-6">
        Customer Dashboard
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-lg shadow p-3 lg:p-4 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-0 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex-shrink-0 flex mt-3 items-center justify-center lg:justify-start gap-2 px-2 lg:px-4 py-1.5 lg:py-3 rounded-md text-sm font-medium transition ${
                activeTab === item.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="text-base md:text-lg" />
              <span className="inline">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
