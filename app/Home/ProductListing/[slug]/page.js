"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/app/envfile/api";
import wallLamp from "../../../../assets/wall-lamp.webp";
import ceilingLamp from "../../../../assets/Ceiling-Lamp.webp";
import tableLamp from "../../../../assets/Table-Lamp.jpg";
import pendantLamp from "../../../../assets/Pendan-tLamp.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import NotLoggedInModal from "@/components/Modal/NotLoggedInModal";
import EnquiryModal from "@/components/Modal/ProductEnquiryModal";

export default function ProductDetails() {
  const router = useRouter();
  const thumbnailRef = useRef(null);

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [open, setOpen] = useState(false);

  const submitEnquiry = async (payload) => {
    console.log("Enquiry payload:", payload);

    // Example API call
    // await axios.post("/api/enquiry", payload);

    setOpen(false);
  };
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.post(`${api}/api/products/getslug`, {
          slug,
        });
        if (res.data.success) {
          setProduct(res.data.data);
          setSelectedImage(res.data.data.images?.[0] || "/placeholder.png");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api}/api/products/get`);
        if (res.data.success) setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${api}/api/category/subcategories`);
        if (res.data.success) setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProduct();
    fetchProducts();
    fetchCategory();
  }, [slug]);

  if (!product) {
    return <p className="text-center py-20">Loading product...</p>;
  }

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      setShowLoginModal(true);
      return false; // return false if user is not logged in
    }

    setCartLoading(true);
    try {
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.recordId;

      const body = { userId, productRecordId: productId };

      const res = await axios.post(`${api}/admin/cart/add`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAddedToCart(true);
        return true; // added successfully
      } else {
        alert("Failed to add to cart");
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      return false;
    } finally {
      setCartLoading(false);
    }
  };

  // Add to Cart button
  const handleAddToCartClick = async (productId) => {
    const success = await handleAddToCart(productId);
    if (success) {
      router.push("/Home/Cart");
    }
  };

  // Buy Now button
  const handleBuyNow = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    const success = await handleAddToCart(productId);
    if (success) {
      router.push("/Home/CheckoutPage");
    }
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = thumbnailRef.current.clientWidth / 2; // scroll half width
      if (direction === "left") {
        thumbnailRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        thumbnailRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="mt-4 gap-10">
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            className="w-full h-[200px] md:h-[200px] lg:h-[400px] border rounded-xl shadow-md flex items-center justify-center bg-white"
          >
            <Image
              src={selectedImage}
              alt="Product Preview"
              width={400}
              height={400}
              className="object-contain w-full h-full rounded-xl"
            />
          </div>
          {isZooming && (
            <div className="w-[500px] h-[450px] hidden lg:flex border rounded-xl shadow-lg bg-white absolute top-24 right-5 overflow-hidden">
              <Image
                src={selectedImage}
                alt="Zoom Preview"
                width={800}
                height={1200}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(2) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transition: "transform 0.05s ease-out",
                }}
              />
            </div>
          )}
          <div className="pt-5">
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={4} // show 4 thumbnails at a time
              navigation
              className="mySwiper"
            >
              {product.carouselImages?.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <button
                    onClick={() => setSelectedImage(img)}
                    className={`border rounded-lg p-1 w-full ${
                      selectedImage === img
                        ? "border-red-600"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-12 md:h-16 lg:h-28 rounded-lg"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {product.identifier}
          </div>
          <div className="text-gray-600 mb-6">{product.description}</div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-red-600">
              ₹{product.discountPrice}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.price}
            </span>
            <span className="text-green-600 font-semibold">
              {Math.round(
                ((product.price - product.discountPrice) / product.price) * 100
              )}
              % OFF
            </span>
          </div>

          {/* Highlights Section */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Highlights
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            {product.stock > 0 ? (
              <>
                {/* <button
                  onClick={() => {
                    handleAddToCartClick(product.recordId);
                  }}
                  disabled={cartLoading || addedToCart}
                  className={`py-2 px-6 cursor-pointer rounded-lg font-semibold shadow-md transition ${
                    addedToCart
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-[#A52A2A] text-white hover:bg-red-700"
                  }`}
                >
                  {cartLoading
                    ? "Adding..."
                    : addedToCart
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>
                <button
                  onClick={()=>{
                    handleBuyNow(product.recordId)
                  }}
                  className="bg-red-600 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                >
                  Buy Now
                </button> */}
                <button className="bg-[#A52A2A] text-white py-2 px-6 cursor-pointer rounded-lg font-semibold shadow-md" onClick={() => setOpen(true)}>Enquire Now</button>

                <EnquiryModal
                  open={open}
                  onClose={() => setOpen(false)}
                  product={product}
                  onSubmit={submitEnquiry}
                />
              </>
            ) : (
              <div className="text-white font-semibold cursor-not-allowed px-6 py-3 rounded-lg bg-[#a54b4b]">
                Currently Unavailable
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="my-10">
        <div className="text-2xl font-bold mb-6">
          Shop By this Category{" "}
          <span className="text-red-600">
            {product.subcategory?.identifier}
          </span>
        </div>
        <Swiper
          slidesPerView={4} // show 3 products at a time (adjust for responsiveness)
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 1 }, // Mobile
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products
            .filter(
              (item) =>
                item.subcategory?.recordId === product.subcategory?.recordId &&
                item.recordId !== product.recordId
            ) // optional: show max 12 products in swiper
            .map((item, index) => (
              <SwiperSlide key={index}>
                <div className="border rounded-xl shadow hover:shadow-lg transition p-4 bg-white flex flex-col">
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.images?.[0] || item.identifier}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-[200px]"
                  />
                  <div className="text-lg font-semibold mt-4">
                    {item.identifier}
                  </div>
                  <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {item.description}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-red-600">
                        ₹{item.discountPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{item.price}
                      </span>
                    </div>
                    {item.discountPrice < item.price && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        On Sale{" "}
                        {Math.round(
                          ((item.price - item.discountPrice) / item.price) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                  <button
                    className="mt-4 bg-red-600 cursor-pointer text-white py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/Home/ProductListing/${item.slug}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <div className="my-10">
        <div className="text-2xl font-bold mb-6">More Products</div>
        <Swiper
          slidesPerView={4} // show 3 products at a time (adjust for responsiveness)
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 1 }, // Mobile
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products
            .filter((item) => item.recordId !== product.recordId) // exclude current product
            .slice(0, 12) // optional: show max 12 products in swiper
            .map((item, index) => (
              <SwiperSlide key={index}>
                <div className="border rounded-xl shadow hover:shadow-lg transition p-4 bg-white flex flex-col">
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.images?.[0] || item.identifier}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover w-full h-[200px]"
                  />
                  <div className="text-lg font-semibold mt-4">
                    {item.identifier}
                  </div>
                  <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {item.description}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-red-600">
                        ₹{item.discountPrice}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{item.price}
                      </span>
                    </div>
                    {item.discountPrice < item.price && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        On Sale{" "}
                        {Math.round(
                          ((item.price - item.discountPrice) / item.price) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                  <button
                    className="mt-4 bg-red-600 cursor-pointer text-white py-2 rounded-lg hover:bg-red-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/Home/ProductListing/${item.slug}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <div className="max-w-6xl mx-auto py-16">
        <div className="text-2xl font-bold mb-8 text-center">
          Want to Explore More?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((col, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
              onClick={() =>
                router.push(
                  `/Home/ProductsByCategory?category=${col.recordId}&name=${col.identifier}`
                )
              }
            >
              <Image
                src={col.image}
                alt={col.name}
                width={400}
                height={400}
                className="object-cover w-full h-72 transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/60 translate-y-full group-hover:translate-y-0 transition duration-500 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {col.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <NotLoggedInModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        content="You need to log in to view your cart items."
        redirectPath="/login"
      />
    </div>
  );
}
