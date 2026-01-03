"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { api } from "@/app/envfile/api";
import {
  FaDownload,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaSpinner,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // 🔹 confirmation modal
  const [selectedOrder, setSelectedOrder] = useState(null);


  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (recordId) => {
    setExpandedOrderId((prev) => (prev === recordId ? null : recordId));
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      if (!token || !user) {
        toast.error("You are not logged in!");
        return;
      }
      const userRecordId = JSON.parse(user).recordId;
      const res = await axios.post(
        `${api}/admin/order/user-orders`,
        { userId: userRecordId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = (order) => {
    setSelectedOrder(order);
    setConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmOpen(false);
    setSelectedOrder(null);
  };

  const CancelOrders = async (recordId) => {
    try {
      setConfirmOpen(false);
      setIsModalOpen(true); // show loader

      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        toast.error("⚠️ You are not logged in!");
        setIsModalOpen(false);
        return;
      }

      const userRecordId = JSON.parse(user).recordId;
      const body = { orderRecordId: recordId, userId: userRecordId };

      const res = await axios.post(`${api}/admin/order/cancel-order`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Handle success case
      if (res.data?.success) {
        const order = res.data.data;

        // Show more informative message
        toast.success(
          `✅ Order ${
            order.orderId || recordId
          } cancelled successfully!\nRefund Status: ${
            order.transactions?.[0]?.status || "Processing"
          }`
        );

        // Refresh orders list
        fetchUserOrders();
      } else {
        toast.error(res.data?.message || "❌ Failed to cancel order");
      }
    } catch (err) {
      console.error("❌ Cancel Order Error:", err);
      toast.error(
        err.response?.data?.message ||
          "Error cancelling order. Please try again."
      );
    } finally {
      setIsModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDownloadInvoice = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("🛒 Your Store Name", 14, 20);
      doc.setFontSize(12);
      doc.text(`Invoice for Order #${order.orderId || order.recordId}`, 14, 30);
      doc.text(
        `Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`,
        14,
        37
      );
      doc.line(14, 42, 195, 42);

      const address = order.shippingAddress || {};
      doc.setFontSize(11);
      doc.text("Bill To:", 14, 50);
      doc.text(`${address.firstName || ""} ${address.lastName || ""}`, 14, 56);
      doc.text(`${address.line1 || ""}`, 14, 62);
      if (address.line2) doc.text(`${address.line2}`, 14, 68);
      doc.text(`${address.city || ""}, ${address.state || ""}`, 14, 74);
      doc.text(`${address.country || ""} - ${address.pinCode || ""}`, 14, 80);
      doc.text(`Phone: ${address.phone || ""}`, 14, 86);

      const tableData = order.items.map((item, i) => [
        i + 1,
        item.name,
        item.quantity,
        `₹${item.basePrice}`,
        `₹${item.totalPrice}`,
      ]);

      autoTable(doc, {
        head: [["#", "Product", "Qty", "Price", "Total"]],
        body: tableData,
        startY: 95,
      });

      const finalY = doc.lastAutoTable.finalY || 120;
      doc.setFontSize(12);
      doc.text(`Subtotal: ₹${order.subtotal || order.total}`, 150, finalY + 10);
      if (order.discount)
        doc.text(`Discount: ₹${order.discount}`, 150, finalY + 16);
      doc.setFontSize(13);
      doc.text(`Grand Total: ₹${order.total}`, 150, finalY + 24);

      doc.setFontSize(10);
      doc.text("Thank you for shopping with us!", 14, finalY + 40);
      doc.save(`Invoice_${order.orderId || order.recordId}.pdf`);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate invoice.");
    }
  };

  const statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.orderStatus?.toLowerCase() === filter.toLowerCase()
        );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "text-yellow-600", bg: "bg-yellow-100", icon: FaClock };
      case "confirmed":
        return {
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: FaCheckCircle,
        };
      case "shipped":
        return { color: "text-purple-600", bg: "bg-purple-100", icon: FaTruck };
      case "delivered":
        return {
          color: "text-green-600",
          bg: "bg-green-100",
          icon: FaCheckCircle,
        };
      case "cancelled":
        return { color: "text-red-600", bg: "bg-red-100", icon: FaTimes };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", icon: FaClock };
    }
  };

  return (
    <div className="min-h-screen p-0.5 md:p-10 bg-gray-50">
  <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#7a1717] text-center md:text-left">
    My Orders
  </h1>

  <Toaster position="top-right" reverseOrder={false} />

  {/* Filter Buttons */}
  <div className="flex overflow-x-scroll lg:overflow-x-hidden lg:flex-wrap gap-2 mb-6 scrollbar-hide">
    {statuses.map((s) => (
      <button
        key={s}
        onClick={() => setFilter(s)}
        className={`px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap ${
          filter === s
            ? "bg-[#7a1717] text-white border-[#7a1717]"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {s}
      </button>
    ))}
  </div>

  {/* Orders */}
  {loading ? (
    <p className="text-center text-gray-500">Loading orders...</p>
  ) : filteredOrders.length === 0 ? (
    <p className="text-center text-gray-500">No orders found.</p>
  ) : (
    <div className="space-y-6">
      {filteredOrders.map((order) => {
        const statusLabel = order.orderStatus
          ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
          : "Pending";
        const { color, bg } = getStatusStyle(statusLabel);

        return (
          <div
            key={order.recordId}
            className="border border-gray-200 rounded-2xl p-4 md:p-5 shadow-md bg-white hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-3 mb-4 gap-2">
              <div>
                <p className="text-lg md:text-xl font-bold text-[#7a1717]">
                  Order #{order.orderId || order.recordId}
                </p>
                <p className="text-gray-500 text-sm">
                  Placed on: {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3 items-center">
                {statusLabel === "Delivered" && (
                  <button
                    onClick={() => handleDownloadInvoice(order)}
                    className="px-3 py-1.5 rounded-full text-white bg-[#a52a2a] flex items-center gap-1 hover:bg-[#7a1717] text-sm"
                  >
                    <FaDownload /> Invoice
                  </button>
                )}
                <div
                  className={`flex items-center gap-2 ${bg} ${color} font-semibold text-xs md:text-sm px-3 py-1.5 rounded-full`}
                >
                  {statusLabel}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 border-b pb-3 last:border-b-0"
                >
                  <div className="w-52 h-32   relative flex-shrink-0">
                    <Image
                      src={item.images?.[0] || "/no-image.png"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 w-full flex justify-between items-center sm:items-start sm:flex-row flex-col text-center sm:text-left">
                    <div>
                      <p className="font-medium text-[#a52a2a] text-base md:text-lg">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#a52a2a] text-base md:text-lg">
                      ₹{item.totalPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-4 mt-3 border-t gap-3">
              <p className="text-lg font-bold">
                Total: <span className="text-[#7a1717]">₹{order.total}</span>
              </p>
              <div className="space-x-2 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleExpand(order.recordId)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
                >
                  {expandedOrderId === order.recordId ? (
                    <>
                      Hide Details <FaChevronUp />
                    </>
                  ) : (
                    <>
                      View Details <FaChevronDown />
                    </>
                  )}
                </button>

                {order.orderStatus !== "delivered" &&
                  order.orderStatus !== "cancelled" && (
                    <button
                      onClick={() => openConfirmModal(order)}
                      className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>

            {/* Dropdown Details */}
            {expandedOrderId === order.recordId && (
              <div className="mt-5 bg-gray-50 border rounded-xl p-4 md:p-5 space-y-4 animate-fadeIn">
                <h3 className="font-semibold text-lg text-[#7a1717] border-b pb-1">
                  Delivery & Payment Details
                </h3>

                {/* Shipping Address */}
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Shipping Address:</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.line1}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                  <p className="text-gray-600">
                    📞 {order.shippingAddress.phone} | ✉️ {order.shippingAddress.email}
                  </p>
                </div>

                {/* Billing Address */}
                {order.billingAddress && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Billing Address:</p>
                    <p className="text-gray-600">
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </p>
                    <p className="text-gray-600">
                      {order.billingAddress.line1}, {order.billingAddress.city},{" "}
                      {order.billingAddress.state} - {order.billingAddress.pinCode}
                    </p>
                    <p className="text-gray-600">{order.billingAddress.country}</p>
                    <p className="text-gray-600">
                      📞 {order.billingAddress.phone} | ✉️ {order.billingAddress.email}
                    </p>
                  </div>
                )}

                {/* Transactions */}
                {order.transactions?.length > 0 && (
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">Transaction Details:</p>
                    {order.transactions.map((txn, i) => (
                      <div key={i} className="mt-1 text-gray-600">
                        💳 Method: {txn.paymentMethod?.toUpperCase()}  
                        <br />
                        💰 Amount: ₹{txn.amount}  
                        <br />
                        📅 Date:{" "}
                        {new Date(txn.createdAt).toLocaleString("en-IN")}
                        <br />
                        🧾 Status:{" "}
                        <span className="font-semibold text-green-700">
                          {txn.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Delivery Method */}
                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    Delivery Method:{" "}
                    <span className="text-gray-600">{order.deliveryMethod}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}

  {/* Confirm Cancel Modal */}
  {confirmOpen && selectedOrder && (
    <div className="fixed inset-0 z-40 bg-black/40 flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 w-full max-w-xs sm:max-w-sm text-center">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
          Cancel this order?
        </h2>
        <p className="text-gray-600 text-sm mb-5">
          Are you sure you want to cancel{" "}
          <span className="font-semibold text-[#7a1717]">
            {selectedOrder.orderId}
          </span>
          ?
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => CancelOrders(selectedOrder.recordId)}
            disabled={isModalOpen}
            className={`px-4 py-2 rounded-md text-white text-sm ${
              isModalOpen
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isModalOpen ? "Cancelling..." : "Yes, Cancel"}
          </button>

          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
          >
            No, Keep It
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Loader Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 z-50 bg-black/50 flex flex-col justify-center items-center backdrop-blur-sm">
      <div className="bg-white px-6 py-5 md:px-8 md:py-6 rounded-xl shadow-xl flex flex-col items-center w-[90%] max-w-xs">
        <FaSpinner className="animate-spin text-3xl md:text-4xl text-[#7a1717] mb-3" />
        <p className="text-[#7a1717] font-semibold text-sm md:text-base">
          Processing your request...
        </p>
      </div>
    </div>
  )}
</div>

  );
}
