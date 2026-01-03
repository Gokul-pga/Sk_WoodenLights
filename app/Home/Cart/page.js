"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCartItems, setCartLength } from "@/Redux/Slice/CartSlice";
import { api } from "@/app/envfile/api";
import NotLoggedInModal from "@/components/Modal/NotLoggedInModal";
import { MdShoppingCart } from "react-icons/md";

const CartPage = () => {
  const router = useRouter();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔹 Helper function to safely get user + token
  const getAuthDetails = () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) return { valid: false };
    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser?.recordId) return { valid: false };
      return { valid: true, token, userId: parsedUser.recordId };
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      return { valid: false };
    }
  };

  // ✅ Fetch Cart
  const fetchCart = async () => {
    const auth = getAuthDetails();
    if (!auth.valid) {
      console.log("redirect to login page");
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${api}/admin/cart/get`,
        { userId: auth.userId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (res.data.success) {
        setCartData(res.data.data);
        dispatch(setCartItems(res.data.data.items));
        console.log(res.data.data.items.length, "Cart length updated");
      } else {
        console.error("Failed to load cart:", res.data.message);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove Cart Item
  const RemoveCart = async (productId) => {
    const auth = getAuthDetails();
    if (!auth.valid) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${api}/admin/cart/remove`,
        { userId: auth.userId, productRecordId: productId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (res.data.success) {
        setCartData(res.data.data);
        dispatch(setCartItems(res.data.data.items));
      } else {
        console.error("Failed to remove item:", res.data.message);
      }
    } catch (error) {
      console.error("Remove cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Quantity
  const updateQuantity = async (productId, change) => {
    const auth = getAuthDetails();
    if (!auth.valid) {
      setShowLoginModal(true);
      return;
    }

    const currentItem = cartData?.items?.find(
      (item) => item.productId === productId
    );
    if (!currentItem) return;

    const newQuantity = Math.max(1, currentItem.quantity + change);

    try {
      setLoading(true);
      const res = await axios.post(
        `${api}/admin/cart/update`,
        {
          userId: auth.userId,
          productRecordId: productId,
          quantity: newQuantity,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (res.data.success) {
        fetchCart();
      } else {
        console.error("Failed to update cart:", res.data.message);
      }
    } catch (error) {
      console.error("Update quantity error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `₹${price.toLocaleString("en-IN")}`;

  return (
    <div style={{ fontFamily: "sans-serif" }} className="lg:p-6 space-y-8 p-2">
      {/* 🔹 Loading Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-lg">
            <div className="w-16 h-16 border-4 border-t-[#a52a2a] border-gray-200 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-800 font-medium">Loading...</p>
          </div>
        </div>
      )}

      <div className="text-3xl w-full flex flex-row gap-3 justify-center items-center text-center font-bold mb-6 pb-2 text-[#a52a2a]">
        Shopping Cart <MdShoppingCart className="text-3xl" />
      </div>

      {!cartData || cartData.items.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg shadow-inner">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <button
            onClick={() => router.push("/Home")}
            className="mt-4 p-3 bg-gradient-to-r cursor-pointer from-[#a52a2a] to-[#800000] text-white rounded hover:from-[#800000] hover:to-[#a52a2a] transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row w-full justify-between gap-6">
          {/* ✅ Cart Items */}
          <div className="w-full lg:w-[65%] space-y-4">
            {cartData.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center sm:items-start border border-slate-200 p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-cover w-full sm:w-40 h-40 rounded mb-4 sm:mb-0 sm:mr-4 border"
                />

                {/* Product Info */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Product ID: {item.productId}
                  </p>
                  <p className="text-xl font-bold mt-2 text-[#a52a2a]">
                    {formatPrice(item.discountPrice)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-center mt-4 sm:mt-0 sm:ml-4">
                  <div className="flex items-center border rounded-md overflow-hidden px-2 py-1 bg-[#fff0f0]">
                    <button
                      className="p-2 w-8 h-8 bg-[#a52a2a] rounded-md cursor-pointer text-white hover:bg-[#800000]"
                      onClick={() => updateQuantity(item.productId, -1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="p-2 w-8 text-center font-semibold text-[#a52a2a]">
                      {item.quantity}
                    </span>
                    <button
                      className="p-2 w-8 h-8 cursor-pointer rounded-md bg-[#a52a2a] text-white hover:bg-[#800000]"
                      onClick={() => updateQuantity(item.productId, 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="text-sm text-red-500 mt-2 hover:text-red-700"
                    onClick={() => RemoveCart(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Order Summary */}
          <div className="w-full lg:w-[35%] p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-xl bg-white sticky top-8 h-fit">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 border-b pb-3 text-[#a52a2a] text-center sm:text-left">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base sm:text-lg">
                  Subtotal ({cartData.summary.itemsCount} items)
                </span>
                <span className="font-medium text-base sm:text-lg">
                  {formatPrice(cartData.summary.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-base sm:text-lg">
                  Discount
                </span>
                <span className="font-medium text-base sm:text-lg text-green-600">
                  -{formatPrice(cartData.summary.discount)}
                </span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg sm:text-xl border-t border-gray-300 pt-4 mt-4">
                <span>Total</span>
                <span className="text-[#a52a2a]">
                  {formatPrice(cartData.summary.total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push("/Home/CheckoutPage")}
              className="w-full p-3 text-white cursor-pointer font-bold rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-[#a52a2a] to-[#800000] hover:from-[#800000] hover:to-[#a52a2a] text-base sm:text-lg"
            >
              Proceed to Checkout
            </button>

            <p className="text-sm text-center text-gray-400 mt-3">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      )}
      <NotLoggedInModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        content="You need to log in to view your cart items."
        redirectPath="/login"
      />
    </div>
  );
};

export default CartPage;
