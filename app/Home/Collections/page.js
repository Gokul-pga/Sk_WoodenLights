"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { api } from "@/app/envfile/api";
import axios from "axios";

export default function CollectionPage() {
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${api}/api/products/get`),
        axios.get(`${api}/api/category/subcategories`),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (!showSaleOnly || p.onSale) && p.price >= minPrice && p.price <= maxPrice
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-xl">Loading...</p>
      </div>
    );
  }

  if (error || (!products.length && !categories.length)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-xl">No data found.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#fef9f5] min-h-screen py-6 px-6 md:px-20">
      {/* Top Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
          Explore Our <span className="text-red-600">Collections</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover lighting designs that match your style — from cozy wall lamps
          to bold ceiling chandeliers.
        </p>
      </div>

      {/* Categories Slider */}
      {categories.length ? (
        <div className="mb-20 pb-5">
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              0: { slidesPerView: 1 }, // Mobile
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              // 1280: { slidesPerView: 4 },
            }}
            className="mySwiper"
          >
            {categories.map((collection) => (
              <SwiperSlide key={collection.recordId}>
                <div className="rounded-2xl shadow-lg overflow-hidden group">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-lg font-bold">
                        {collection.identifier}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      {collection.identifier}
                    </h3>
                    <p className="mt-3 text-gray-600 text-sm">
                      {collection.shortDescription}
                    </p>
                    <div
                      onClick={() =>
                        router.push(
                          `/Home/ProductsByCategory?category=${collection.recordId}&name=${collection.identifier}`
                        )
                      }
                      className="inline-block mt-5 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow cursor-pointer"
                    >
                      Explore
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-center text-gray-600">No collections available.</p>
      )}

      {/* Products Grid */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Featured Lights</h2>
        <p className="mt-3 text-gray-600">
          Handpicked lights from our latest collection
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center gap-6 bg-white p-6 rounded-xl shadow">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSaleOnly}
            onChange={(e) => setShowSaleOnly(e.target.checked)}
          />
          Show Sale Only
        </label>
        <div className="flex items-center gap-2">
          <span>₹</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-20 border p-1 rounded"
          />
          <span>-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-20 border p-1 rounded"
          />
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product.recordId}
              onClick={() =>
                router.push(`/Home/ProductListing/${product.slug}`)
              }
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition-transform relative group"
            >
              <div className="relative h-64 overflow-hidden">
                {product.onSale && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    SALE
                  </span>
                )}
                <Image
                  src={product.images[0]}
                  alt={product.identifier}
                  width={400}
                  height={350}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center px-2 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-sm font-semibold text-center w-full truncate">
                    {product.identifier}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.identifier}
                </h3>
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {product.description}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xl font-bold text-gray-800">
                    ₹{product.price}
                  </span>
                </div>
                <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">
          No products found matching the filters.
        </p>
      )}

      <div className="mt-20 text-center bg-red-50 p-10 rounded-2xl shadow-inner">
        <h2 className="text-2xl font-bold text-gray-800">
          Didn’t find what you’re looking for?
        </h2>
        <p className="mt-3 text-gray-600">
          Reach out to us for <strong>custom lighting designs</strong> crafted
          for your unique space.
        </p>
        <div
          onClick={() => router.push("/Home/ContactUs")}
          className="inline-block mt-6 bg-red-600 cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
        >
          Contact Us
        </div>
      </div>
    </section>
  );
}
