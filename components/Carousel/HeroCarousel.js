"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useRouter } from "next/navigation";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { api } from "@/app/envfile/api";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${api}/api/banners/all`);
        setSlides(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

  if (!slides.length)
    return (
      <p className="w-full flex flex-row text-center">Loading banners...</p>
    );

  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {slides
          .filter((slide) => slide.type === "home")
          .map((slide) => (
            <SwiperSlide key={slide._id}>
              <div className="group relative w-full min-h-[500px] max-h-[500px] flex items-center justify-center">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter md:grayscale md:group-hover:grayscale-0 transition duration-700"
                  style={{ backgroundImage: `url(${slide.image})` }}
                ></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Text */}
                <div className="relative z-10 text-center text-white px-8">
                  <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                    {slide.identifier}
                  </h2>
                  <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto drop-shadow">
                    {slide.subtitle}
                  </p>
                  {slide.buttonText && (
                    <button
                      onClick={() => {
                        if (
                          slide.actionType === "category" &&
                          slide.targetCategory
                        ) {
                          router.push(
                            `/Home/ProductsByCategory?category=${slide.targetCategory.recordId}&name=${slide.targetCategory.identifier}`
                          );
                        } else if (
                          slide.actionType === "product" &&
                          slide.targetProduct
                        ) {
                          router.push(
                            `/Home/ProductListing/${slide.targetProduct.slug}`
                          );
                        }
                      }}
                      className="mt-6 px-6 py-3 cursor-pointer rounded-full font-semibold shadow-lg transition"
                      style={{
                        backgroundColor: slide.buttonColor || "#f5f",
                        color: slide.textColor || "#ffffff",
                      }}
                    >
                      {slide.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
