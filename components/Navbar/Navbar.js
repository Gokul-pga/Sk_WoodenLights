"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/SK_Logo.png";
import Image from "next/image";
import { FaUserAlt } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { getCookie, deleteCookie } from "cookies-next";

// MUI
import {
  Drawer,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Icons
import { MdFavoriteBorder, MdShoppingBag, MdLogout } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "@/app/envfile/api";
import { HomeIcon } from "lucide-react";
import { HomeFilled } from "@mui/icons-material";
import NotLoggedInModal from "../Modal/NotLoggedInModal";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartLenght, setCartLenght] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const navItems = ["Home", "Collections", "AboutUs", "ContactUs"];
  const cartItems = useSelector((state) => state.cart.items);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("");

  const handleProtectedNavigation = (path, message) => {
    setDrawerOpen(false);
    if (isLoggedIn) {
      router.push(path);
    } else {
      setLoginMessage(message);
      setRedirectPath(path);
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetchCart(token);
  }, [cartItems]);

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

  // ✅ Fetch Cart API
  const fetchCart = async (token) => {
    const userId = getUserId();
    if (!userId) {
      // router.push("/login");
      // setShowLoginModal(true);
      return;
    }

    try {
      const res = await axios.post(
        `${api}/admin/cart/get`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        // setCartData(res.data.data);
        setCartLenght(res.data.data.items?.length || 0);
        console.log(res.data.data.items.length, "Cart length updated");
      } else {
        console.error("Failed to load cart:", res.data.message);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const isActive = (item) => {
    if (item === "Home") return pathname === "/Home" || pathname === "/";
    return pathname.toLowerCase() === `/home/${item.toLowerCase()}`;
  };

  const handleLogout = () => {
    deleteCookie("jwtToken"); // ✅ remove cookie
    localStorage.clear();
    setIsLoggedIn(false);
    setDrawerOpen(false);
    setCartLenght(0);
    // Redirect and force a page reload
    router.push("/Home");
    // setTimeout(() => {
    //   window.location.href = "/Home"; // Ensures full reload
    // }, 100);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <nav className="shadow-lg sticky top-0 z-50 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-1 md:py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            onClick={() => router.push("/Home")}
            src={logo}
            alt="logo"
            className="bg-black w-[60px] md:w-[90px] lg:w-[120px] md:absolute md:top-2 rounded-full cursor-pointer"
          />
          <div className="hidden lg:flex pl-36 flex-col">
            <Link
              href="/Home"
              className="text-2xl md:text-3xl font-extrabold text-red-600 tracking-wide drop-shadow-sm"
            >
              S.K. WOODEN <span className="text-black">FANCY LIGHTS</span>
            </Link>
            <span className="text-xs md:text-sm text-red-500 italic tracking-wide">
              Let more light shine in your life ✨
            </span>
          </div>
        </div>

        {/* Desktop Links + Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav Links */}
          <ul className="flex gap-6 font-semibold text-lg text-black">
            {navItems.map((item) => (
              <li key={item} className="relative">
                <Link
                  href={item === "Home" ? "/Home" : "/Home/" + item}
                  className={`transition ${
                    isActive(item)
                      ? "text-red-600"
                      : "text-gray-800 hover:text-red-600"
                  }`}
                >
                  {item}
                </Link>
                {isActive(item) && (
                  <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-red-600"></span>
                )}
              </li>
            ))}
          </ul>

          {/* Cart */}
          {/* <Link
            href="/Home/Cart"
            className="relative text-gray-800 hover:text-red-600 transition"
          >
            <MdShoppingCart className="text-3xl" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-sm text-white rounded-full px-1.5 py-0 shadow">
              {cartLenght}
            </span>
          </Link> */}

          {/* User Menu Drawer */}
          {/* <div>
            <Button
              onClick={toggleDrawer(true)}
              sx={{
                minWidth: 0,
                p: 1.2,
                borderRadius: "50%",
                bgcolor: "#a52a2a",
                "&:hover": { bgcolor: "#822020" },
              }}
            >
              <FaUserAlt color="#fff" />
            </Button>
          </div> */}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-800 hover:text-red-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
  className={`md:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden z-50 ${
    mobileOpen ? "top-[64px] max-h-96 py-4" : "top-[64px] max-h-0 py-0"
  }`}
>
  <ul className="flex flex-col gap-0 px-4">
    {navItems.map((item) => (
      <li key={item}>
        <Link
          href={item === "Home" ? "/Home" : "/Home/" + item}
          className={`block py-2 text-lg font-semibold ${
            isActive(item)
              ? "text-red-600"
              : "text-gray-800 hover:text-red-600"
          }`}
          onClick={() => setMobileOpen(false)}
        >
          {item}
        </Link>
      </li>
    ))}

    {/* Cart */}
    {/* <li>
      <Link
        href="/Home/Cart"
        className="block py-2 text-lg font-semibold text-gray-800 hover:text-red-600"
        onClick={() => setMobileOpen(false)}
      >
        Cart
      </Link>
    </li> */}

    {/* ✅ Account / Login & Logout Row */}
    {/* <li className="">
      {isLoggedIn ? (
        <div className="flex gap-3">
          <Link
            href="/Home/MyAccount"
            onClick={() => setMobileOpen(false)}
            className="flex-1 text-center py-1 px-4 rounded-md text-lg font-semibold text-white bg-[#A52A2A] hover:bg-[#7a1717] transition duration-200 shadow-md hover:shadow-lg"
          >
            My Account
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="flex-1 text-center py-1 px-4 rounded-md text-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/Home/Login"
          onClick={() => setMobileOpen(false)}
          className="block w-full text-center py-2.5 px-4 rounded-md text-lg font-semibold text-white bg-[#A52A2A] hover:bg-[#7a1717] transition duration-200 shadow-md hover:shadow-lg"
        >
          Login / Register
        </Link>
      )}
    </li> */}
  </ul>
</div>


      {/* <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }} role="presentation">
          {isLoggedIn ? (
            <Button
              fullWidth
              variant="contained"
              // Updated background and hover colors
              sx={{
                mb: 2,
                bgcolor: "#a52a2a",
                "&:hover": { bgcolor: "#800000" },
              }}
              onClick={() => {
                setDrawerOpen(false);
                router.push("/Home/MyAccount");
              }}
            >
              My Account
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{
                mb: 2,
                bgcolor: "#a52a2a",
                "&:hover": { bgcolor: "#800000" },
              }}
              onClick={() => {
                setDrawerOpen(false);
                router.push("/login");
              }}
            >
              Log in / Register
            </Button>
          )}

          <div className="flex flex-col gap-3 ">
            <div
              onClick={() =>
                handleProtectedNavigation(
                  "/Home/MyAccount?tab=orders",
                  "You need to log in to view your order history."
                )
              }
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 cursor-pointer transition-colors bg-white shadow-sm"
            >
              <MdShoppingBag className="text-[#a52a2a] text-2xl" />
              <span className="text-gray-800 font-medium">Order History</span>
            </div>

            <div
              onClick={() =>
                handleProtectedNavigation(
                  "/Home/MyAccount?tab=address",
                  "You need to log in to view your saved addresses."
                )
              }
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 cursor-pointer transition-colors bg-white shadow-sm"
            >
              <HomeFilled className="text-[#a52a2a] text-2xl" />
              <span className="text-gray-800 font-medium">Saved Address</span>
            </div>

            {isLoggedIn && (
              <div
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-red-50 cursor-pointer transition-colors bg-white shadow-sm"
              >
                <MdLogout className="text-red-600 text-2xl" />
                <span className="text-red-600 font-medium">Logout</span>
              </div>
            )}
          </div>
        </Box>
      </Drawer> */}
      <NotLoggedInModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        content={loginMessage}
        redirectPath={redirectPath}
      />
    </nav>
  );
}
