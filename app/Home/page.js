"use client";
import HeroCarousel from "@/components/Carousel/HeroCarousel";
import React, { useEffect, useState } from "react";
import img6 from "../../assets/lamp-light-7.jpg";
import img7 from "../../assets/img2.png";
import Image from "next/image";
import wallLamp from "../../assets/wall-lamp.webp";
import ceilingLamp from "../../assets/Ceiling-Lamp.webp";
import tableLamp from "../../assets/Table-Lamp.jpg";
import pendantLamp from "../../assets/Pendan-tLamp.jpg";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import woodImg from "../../assets/wood.png";
import handmadeImg from "../../assets/handmade.png";
import craftImg from "../../assets/craft.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "../envfile/api";
import CategoryPage from "@/components/Category Page/CategoryPage";
import NotLoggedInModal from "@/components/Modal/NotLoggedInModal";
import { MdShoppingCart } from "react-icons/md";

function HomePages() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartStatus, setCartStatus] = useState({});
  const [fAQData, setFAQData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchFAQs();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${api}/api/products/get`);
      if (res.data.success) {
        const trending = res.data.data.filter((p) => p.isTrending);
        setProducts(trending);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`${api}/api/faq/all`);
      if (res.data.success) {
        // const trending = res.data.data.filter((p) => p.isTrending);
        setFAQData(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [loadingCart, setLoadingCart] = useState({}); // track per-product loading

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setShowLoginModal(true);
      return;
    }

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.recordId;

    const body = { userId, productRecordId: productId };

    try {
      setLoadingCart((prev) => ({ ...prev, [productId]: true })); // start loading
      const res = await axios.post(`${api}/admin/cart/add`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setCartStatus((prev) => ({ ...prev, [productId]: true }));
        // ✅ redirect to Cart page after successful add
        router.push("/Home/Cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setLoadingCart((prev) => ({ ...prev, [productId]: false })); // stop loading
    }
  };

  return (
    <div>
      <HeroCarousel />
      {/* Section Heading */}
      <div className="text-center mt-10 mb-6">
        <div className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-wide">
          ✨ Trending Products on <span className="text-red-600">SALE</span> ✨
        </div>
        <div className="text-gray-500 mt-2 text-lg">
          Explore our best-selling lamps and light up your home beautifully.
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">
          No trending products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6 md:px-16 mb-12">
          {products.map((product) => (
            <div
              key={product.recordId}
              onClick={() =>
                router.push(`/Home/ProductListing/${product.slug}`)
              }
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              {/* SALE badge (only if stock > 0) */}
              {product.discountPrice < product.price && product.stock > 0 && (
                <span className="absolute z-30 mt-3 ml-3 bg-[#A52A2A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  SALE
                </span>
              )}

              {/* Product Image */}
              <div className="relative bg-gray-50 h-72 flex items-center justify-center overflow-hidden">
                <Image
                  src={product.images?.[0]}
                  alt={product.identifier}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />

                {/* Overlay Product Name on Hover */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center px-2 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-sm font-semibold text-center w-full truncate">
                    {product.identifier}
                  </h3>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col items-center text-center">
                {/* Animated Product Title */}
                <div
                  className="font-semibold text-lg text-gray-800 group-hover:text-[#A52A2A]
                         transition-all duration-500 transform group-hover:-translate-y-1"
                >
                  {product.identifier}
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-red-600">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    ₹{product.price}
                  </span>
                </div>

                {/* Stock & Cart Section */}
                {product.stock > 0 ? (
                  <button
                    className={`mt-5 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg bg-[#A52A2A] text-white hover:bg-red-700 ${
                      loadingCart[product.recordId]
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!cartStatus[product.recordId]) {
                        await handleAddToCart(product.recordId);
                      }
                    }}
                    disabled={loadingCart[product.recordId]}
                  >
                    {loadingCart[product.recordId] ? (
                      <>
                        <MdShoppingCart className="text-lg animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <MdShoppingCart className="text-lg" />
                        Add to Cart
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mt-5 w-full py-2 rounded-lg font-semibold text-gray-500 bg-gray-100 text-center cursor-not-allowed">
                    Currently Unavailable
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#fef9f5] py-16 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left Content */}
          <div>
            <div className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
              Quality You Can <span className="text-red-600">Count On</span>
            </div>
            <div className="text-gray-600 text-xl leading-relaxed mb-6">
              At{" "}
              <span className="font-semibold text-xl text-red-600">
                SK Wooden Fancy Lights
              </span>
              , we believe that quality should never be compromised. That’s why
              we use only the finest materials and expert craftsmanship to
              create lamps that are built to last. From the design phase to the
              final product, we take pride in every step of the process to
              ensure that you receive a lamp you’ll love for years to come.
            </div>
            <button
              onClick={() => {
                router.push("/Home/AboutUs");
              }}
              className="bg-[#A52A2A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
            >
              READ MORE ABOUT US
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <Image
              src={img7}
              alt="Quality Wooden Lamp"
              className="rounded-2xl shadow-lg w-[80%] max-w-md object-cover"
            />
          </div>
        </div>
      </div>

      <CategoryPage />
      <div className="flex flex-col w-full px-10 mx-auto p-5 gap-28 relative z-10">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fff9f5] via-white to-[#fff0ec]" />

        {/* 1. High-Quality Wood */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Left */}
          <div className="flex-shrink-0 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#f9d6c8] to-[#fdf1ec] rounded-3xl blur-xl opacity-60" />
            <Image
              src={woodImg}
              alt="High quality wood"
              className="relative rounded-3xl shadow-2xl object-cover w-[320px] h-auto border border-[#B8860B]/30 hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Text Right */}
          <div className="flex-1 text-left">
            <div className="text-4xl md:text-5xl font-extrabold mb-6 text-[#6b1d1d] leading-tight">
              High-Quality Wood
            </div>
            <div className="text-[#8c2f2f] text-lg mb-4 font-medium">
              We carefully select premium, sustainable wood ensuring every lamp
              is durable, beautiful, and eco-friendly.
            </div>
            <div className="text-[#8c2f2f]/90 text-base leading-relaxed">
              Our sourcing process guarantees not only strength and durability
              but also an elegant natural finish that enhances the atmosphere of
              any room. By using eco-friendly practices, we combine timeless
              craftsmanship with sustainability.
            </div>
          </div>
        </section>

        {/* 2. Handmade Custom Design */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Text Left */}
          <div className="flex-1 text-left order-2 md:order-1">
            <div className="text-4xl md:text-5xl font-extrabold mb-6 text-[#6b1d1d] leading-tight">
              Handmade Custom Design
            </div>
            <div className="text-[#8c2f2f] text-lg mb-4 font-medium">
              Every lamp is handcrafted by skilled artisans to create unique
              designs tailored to your home decor.
            </div>
            <div className="text-[#8c2f2f]/90 text-base leading-relaxed">
              No two lamps are exactly the same — each piece carries the
              individual touch of the artisan who made it. Whether rustic,
              contemporary, or minimalist, our custom approach ensures your lamp
              perfectly complements your space.
            </div>
          </div>
          {/* Image Right */}
          <div className="flex-shrink-0 relative order-1 md:order-2">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#f9d6c8] to-[#fdf1ec] rounded-3xl blur-xl opacity-60" />
            <Image
              src={handmadeImg}
              alt="Handmade custom lamp"
              className="relative rounded-3xl shadow-2xl object-cover w-[320px] h-auto border border-[#B8860B]/30 hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* 3. Exquisite Craftsmanship */}
        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Left */}
          <div className="flex-shrink-0 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#f9d6c8] to-[#fdf1ec] rounded-3xl blur-xl opacity-60" />
            <Image
              src={craftImg}
              alt="Exquisite craftsmanship"
              className="relative rounded-3xl shadow-2xl object-cover w-[320px] h-auto border border-[#B8860B]/30 hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Text Right */}
          <div className="flex-1 text-left">
            <div className="text-4xl md:text-5xl font-extrabold mb-6 text-[#6b1d1d] leading-tight">
              Exquisite Craftsmanship
            </div>
            <div className="text-[#8c2f2f] text-lg mb-4 font-medium">
              From design to finishing touches, our team ensures every lamp
              meets the highest quality standards.
            </div>
            <div className="text-[#8c2f2f]/90 text-base leading-relaxed">
              Each curve, polish, and finish is handled with meticulous care.
              Our dedication to detail results in lamps that are not only
              functional but also works of art — bringing sophistication and
              warmth into your living spaces.
            </div>
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto py-20 px-6 bg-white">
        <div className="text-4xl font-bold text-center mb-12 text-gray-900">
          Frequently Asked Questions
        </div>

        {/* ✅ If no FAQs available */}
        {fAQData.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No FAQs available at the moment.
          </div>
        ) : (
          <div className="space-y-4">
            {fAQData.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-xl shadow-sm p-5 cursor-pointer transform transition-all duration-300
            ${
              openIndex === index
                ? "border-red-500 shadow-xl bg-gray-50 scale-[1.01]"
                : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
            }`}
                onClick={() => toggleIndex(index)}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-lg md:text-xl font-medium ${
                      openIndex === index ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUpIcon className="w-6 h-6 text-red-600 transform transition-transform duration-300 rotate-180" />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6 text-[#d04949] transform transition-transform duration-300" />
                  )}
                </div>
                {openIndex === index && (
                  <div className="mt-3 text-gray-700">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <NotLoggedInModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        content="You need to log in to view your cart items."
        redirectPath="/cart"
      />
    </div>
  );
}

export default HomePages;
