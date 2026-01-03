"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { api } from "@/app/envfile/api";

export default function CategoryPage({headingShow = true}) {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${api}/api/category/subcategories`);
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-[#fef9f5] py-16 px-6 md:px-20 flex flex-col items-center">
      {/* Header */}
      {headingShow && (
        <div className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Explore Our <span className="text-red-600">Collections</span>
        </div>
      )}

      {/* Swiper Container */}
      <div className="w-full max-w-7xl flex justify-center items-center ">
        <Swiper
          slidesPerView={3} // show 3 products at a time (adjust for responsiveness)
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            0: { slidesPerView: 1 }, // Mobile
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div
                onClick={() =>
                  router.push(
                    `/Home/ProductsByCategory?category=${cat.recordId}&name=${cat.identifier}`
                  )
                }
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
              >
                <div className="relative w-full h-80 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover w-full h-64 transform group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="absolute inset-0 bg-black/60 translate-y-full group-hover:translate-y-0 transition duration-500 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {cat.identifier}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
