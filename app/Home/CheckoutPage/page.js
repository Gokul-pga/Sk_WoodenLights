"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCartItems } from "@/Redux/Slice/CartSlice";

// Dummy images
import cardImg from "../../../assets/card.png";
import upiImg from "../../../assets/upi.png";
import codImg from "../../../assets/cod.png";
import Gpay from "../../../assets/gpay.png";
import PhonePe from "../../../assets/phonepe.png";
import Paytm from "../../../assets/paytm.png";
import animationData from "../../../assets/Lottie_Json/Success.json";
import failureAnimationData from "../../../assets/Lottie_Json/PaymentFailed.json";
import Lottie from "lottie-react";
import { api } from "@/app/envfile/api";
import { FaLocationDot } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [failureMessage, setFailureMessage] = useState("");
  // Get user ID from localStorage
  const getUserId = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user).recordId;
      } catch (e) {
        console.error("Invalid user in localStorage:", e);
      }
    }
    return null;
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    const token = getAuthToken();
    const userId = getUserId();

    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      const body = {
        userId: userId,
      };
      const res = await axios.post(`${api}/admin/user/address/get`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUserAddresses(res.data.data);
        // Set default address if available
        const defaultAddress = res.data.data.find(
          (addr) => addr.isDefaultDelivery
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (res.data.data.length > 0) {
          setSelectedAddress(res.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
    }
  };

  // Fetch cart data
  const fetchCart = async () => {
    const token = getAuthToken();
    const userId = getUserId();

    if (!userId) return;

    try {
      const res = await axios.post(
        `${api}/admin/cart/get`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCartData(res.data.data);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
    fetchCart();
  }, []);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
  });

  const [showAddressForm, setShowAddressForm] = useState(false);

  // Handle address form input change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new address
  const handleAddAddress = async () => {
    const token = getAuthToken();

    try {
      const res = await axios.post(
        `${api}/admin/user/address/add`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        await fetchUserAddresses();
        setShowAddressForm(false);
        setNewAddress({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          country: "India",
          pinCode: "",
        });
      }
    } catch (error) {
      console.error("Add address error:", error);
      alert("Failed to add address");
    }
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    if (!cartData || cartData.items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      const userId = getUserId();

      // Create order in backend
      const orderResponse = await axios.post(
        `${api}/admin/order/create`,
        {
          userId,
          shippingAddress: selectedAddress,
          paymentMethod,
          saveAddress: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        setFailureMessage("Failed to create order. Please try again.");
        setShowFailureModal(true);
        setLoading(false);
        return;
      }

      const { order, razorpayOrder } = orderResponse.data.data;

      if (paymentMethod === "cod") {
        setOrderResult(orderResponse.data.data);
        setShowSuccessModal(true);
        dispatch(setCartItems([]));
        setLoading(false);
        return;
      }

      // Online payment (Razorpay)
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setFailureMessage(
          "Razorpay SDK failed to load. Check your internet connection."
        );
        setShowFailureModal(true);
        setLoading(false);
        return;
      }

      const razorpayKey = "rzp_test_RT2gnkaaYc4ke9";

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "S.K WOODEEN FANCY LIGHTS",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${api}/admin/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderRecordId: order.recordId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              setOrderResult(verifyResponse.data.data);
              setShowSuccessModal(true);
              dispatch(setCartItems([]));
            } else {
              setFailureMessage(
                "Payment verification failed. Please contact support."
              );
              setShowFailureModal(true);
            }
          } catch (error) {
            console.error(error);
            setFailureMessage(
              "Payment verification failed. Please contact support."
            );
            setShowFailureModal(true);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
          email: selectedAddress.email || "",
          contact: selectedAddress.phone,
        },
        theme: { color: "#a52a2a" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setFailureMessage(`Payment failed: ${response.error.description}`);
        setShowFailureModal(true);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      setFailureMessage("Something went wrong while placing the order.");
      setShowFailureModal(true);
      setLoading(false);
    }
  };

  const formatPrice = (price) => `₹${price?.toLocaleString("en-IN") || "0"}`;

  if (!cartData) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a52a2a]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <Toaster />
      <h1 className="text-4xl font-bold w-full text-center text-[#a52a2a] border-b pb-4 mb-6">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="lg:w-2/3 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Select Address</h2>
              <button
                onClick={() => {
                  router.push("/Home/MyAccount?tab=address");
                }}
                // onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-4 py-2 bg-[#a52a2a] cursor-pointer text-white rounded-lg hover:bg-[#800000] transition"
              >
                {showAddressForm ? "Cancel" : "Add/Edit Address"}
              </button>
            </div>

            {/* New Address Form */}
            {showAddressForm && (
              <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                <div
                  onClick={() => {
                    // router.push("/Home/MyAccount?tab=address")
                  }}
                  className="text-lg cursor-pointer font-semibold"
                >
                  Add New Address
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={newAddress.firstName}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={newAddress.lastName}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newAddress.email}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="line1"
                    placeholder="Address Line 1"
                    value={newAddress.line1}
                    onChange={handleAddressChange}
                    className="p-2 border rounded md:col-span-2"
                  />
                  <input
                    type="text"
                    name="line2"
                    placeholder="Address Line 2"
                    value={newAddress.line2}
                    onChange={handleAddressChange}
                    className="p-2 border rounded md:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="PIN Code"
                    value={newAddress.pinCode}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={handleAddressChange}
                    className="p-2 border rounded"
                  />
                </div>
                <button
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save Address
                </button>
              </div>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userAddresses.map((addr) => (
                <div
                  key={addr.recordId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedAddress?.recordId === addr.recordId
                      ? "ring-2 ring-offset-2 ring-amber-300"
                      : "hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div className="flex flex-row w-full justify-between items-center">
                    <h3 className="font-semibold">
                      {addr.firstName} {addr.lastName}
                    </h3>
                    <div className="flex flex-row gap-0 ">
                      <div>
                        <FaLocationDot className="text-2xl text-[#a52a2a]" />
                      </div>
                      <div className="text-[#a52a2a] text-xl font-semibold">
                        {addr.addressType || "Delivery Address"}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{addr.line1}</p>
                  {addr.line2 && <p className="text-gray-600">{addr.line2}</p>}
                  <p className="text-gray-600">
                    {addr.city}, {addr.state} - {addr.pinCode}
                  </p>
                  <p className="text-gray-600">{addr.country}</p>
                  <p className="text-gray-600">Phone: {addr.phone}</p>
                  {selectedAddress?.recordId === addr.recordId && (
                    <span className="text-sm text-[#a52a2a] font-bold mt-2 inline-block">
                      Selected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {/* Card/Razorpay */}
              <label
                className={`flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-[#a52a2a]"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-[#a52a2a]"
                />
                <Image src={cardImg} alt="Card" width={40} height={25} />
                <span>Credit / Debit Card / Net Banking</span>
              </label>

              {/* UPI */}
              <label
                className={`flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md cursor-pointer transition ${
                  paymentMethod === "upi"
                    ? "border-[#a52a2a]"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="accent-[#a52a2a]"
                />
                <Image src={upiImg} alt="UPI" width={40} height={25} />
                <span>UPI</span>
              </label>

              {/* COD */}
              <label
                className={`flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-[#a52a2a]"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-[#a52a2a]"
                />
                <Image src={codImg} alt="COD" width={40} height={25} />
                <span>Cash on Delivery (COD)</span>
              </label>

              {/* UPI QR codes */}
              {/* {paymentMethod === "upi" && (
                <div className="mt-4 p-4 border rounded-lg shadow-inner bg-gray-50 text-center space-y-4">
                  <p className="font-semibold">Scan QR Code with any UPI App</p>
                  <div className="grid grid-cols-3 gap-4 justify-center items-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-1">GPay</span>
                      <Image
                        src={Gpay}
                        alt="GPay QR"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-1">
                        PhonePe
                      </span>
                      <Image
                        src={PhonePe}
                        alt="PhonePe QR"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-sm mb-1">Paytm</span>
                      <Image
                        src={Paytm}
                        alt="Paytm QR"
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                </div>
              )} */}

              {/* Place Order Button */}
              <button
                disabled={loading || !selectedAddress}
                className={`w-full p-4 mt-6 cursor-pointer text-white font-bold rounded-xl transition-all duration-300 shadow-lg text-lg ${
                  loading || !selectedAddress
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#a52a2a] to-[#800000] hover:from-[#800000] hover:to-[#a52a2a]"
                }`}
                onClick={handlePlaceOrder}
              >
                {loading
                  ? "Processing..."
                  : `Place Order - ${formatPrice(cartData.summary.total)}`}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:w-[30%] bg-white p-6 rounded-2xl shadow-xl h-fit sticky top-8">
          <h2 className="text-3xl font-bold mb-6 border-b pb-3 text-[#a52a2a]">
            Order Summary
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">
                Subtotal ({cartData.summary.itemsCount} items)
              </span>
              <span className="font-medium text-lg">
                {formatPrice(cartData.summary.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">Discount</span>
              <span className="font-medium text-lg text-green-600">
                -{formatPrice(cartData.summary.discount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">Tax</span>
              <span className="font-medium text-lg">
                {formatPrice(cartData.summary.tax)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-xl border-t border-gray-300 pt-4 mt-4">
              <span>Order Total</span>
              <span className="text-[#a52a2a]">
                {formatPrice(cartData.summary.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && orderResult && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              className="w-40 h-40 mx-auto"
            />
            <h2 className="text-2xl font-bold text-[#a52a2a] mt-4">
              Order Confirmed 🎉
            </h2>
            <p className="text-gray-600 mt-2 mb-2">
              Your order has been placed successfully!
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Order ID: {orderResult.order?.orderId}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-3 cursor-pointer bg-[#a52a2a] text-white rounded-xl font-semibold hover:bg-[#800000] transition"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/Home/MyAccount?tab=orders");
                }}
              >
                View Orders
              </button>
              <button
                className="px-6 py-3 border cursor-pointer border-[#a52a2a] text-[#a52a2a] rounded-xl font-semibold hover:bg-[#a52a2a] hover:text-white transition"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/Home");
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
      {showFailureModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
            {/* Lottie Animation for Failure */}
            <Lottie
              animationData={failureAnimationData} // your failure animation JSON
              loop={false}
              autoplay={true}
              className="w-40 h-40 mx-auto"
            />

            <h2 className="text-2xl font-bold text-red-600 mt-4">
              Payment Failed ❌
            </h2>

            <p className="text-gray-600 mt-2 mb-2">
              {failureMessage || "Your payment could not be processed."}
            </p>

            <div className="flex gap-4 justify-center mt-4">
              <button
                className="px-6 py-3 cursor-pointer bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                onClick={() => {
                  setShowFailureModal(false);
                  router.push("/Home/Cart"); // redirect to cart so user can retry
                }}
              >
                Retry Payment
              </button>
              <button
                className="px-6 py-3 cursor-pointer border border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition"
                onClick={() => setShowFailureModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
