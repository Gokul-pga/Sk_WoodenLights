"use client"
import Image from "next/image";
import React from "react";
import pendantLamp from "../../../assets/lamp-light-9.jpg";
import lightbg from "../../../assets/lamp-light-11.png";
import bgAbout from "../../../assets/aboutus-bg.jpg";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import CategoryPage from "@/components/Category Page/CategoryPage";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  return (
    <main className="flex flex-col">
      {/* 🌟 Hero Section */}
      <div
        className="relative w-full"
        style={{
          backgroundImage: `url(${bgAbout.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 p-6 md:p-10 items-center text-center lg:text-left">
            {/* 📝 Text Section */}
            <div className="py-10 flex flex-col justify-center items-center lg:items-start flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                About SK Wooden Fancy Lamps
              </h1>
              <p className="text-base md:text-lg text-white leading-relaxed max-w-2xl">
                SK Wooden Fancy Lamps has been creating beautiful wooden lamps
                for over 30 years. Each lamp is handmade with care and attention
                to detail. We pride ourselves on using sustainable materials and
                creating pieces that will last for years to come. Using
                traditional techniques, we craft unique lamps that stand the
                test of time.
              </p>
            </div>

            {/* 🖼️ Image */}
            <div className="flex justify-center flex-1">
              <Image
                alt="pendantLamp"
                src={pendantLamp}
                className="w-[250px] sm:w-[300px] md:w-[350px] rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* 🧱 Info Sections */}
          <div className="flex flex-col md:flex-row w-full p-6 md:p-10 justify-between items-stretch gap-6 md:gap-8">
            {[
              {
                title: "Our Process",
                desc: "Our lamps are made by skilled artisans who carefully select and craft the wood to create stunning designs.",
              },
              {
                title: "Our Mission",
                desc: "We aim to create beautiful and sustainable products that bring warmth and style to your home.",
              },
              {
                title: "Our Quality",
                desc: "We stand behind our products and ensure that each lamp is made to the highest quality standards.",
              },
            ].map((item, i) => (
              <section
                key={i}
                className="flex-1 bg-transparent rounded-2xl p-6 md:p-10 text-center shadow-2xl shadow-gray-900 transform hover:scale-105 transition-transform duration-300"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                  {item.title}
                </h2>
                <p className="text-white text-base md:text-lg">
                  {item.desc}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* 💡 Our Design Approach */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-amber-50 via-white to-amber-50 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 text-amber-800 tracking-tight">
            Our Design Approach
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 md:mb-6 px-2">
            At our core, we believe that beauty and functionality go hand in
            hand. Our design approach combines elegant aesthetics with practical
            functionality, creating lamps that are not only beautiful but also
            practical and easy to maintain.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed px-2">
            We strive for excellence in every aspect of our work, from the
            initial design to the finishing touches.
          </p>
        </div>
      </section>

      {/* 🏮 Lamp Categories */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white relative">
        <div className="max-w-6xl mx-auto text-center mb-10 md:mb-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 text-amber-800 tracking-tight">
            Our Lamp Collections
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Explore our beautiful collection of lamps crafted with passion and
            care.
          </p>
        </div>

        <CategoryPage headingShow={false} /> 
      </section>

      {/* 🛒 Call to Action */}
      <div
        className="text-center pb-16 px-4 bg-gradient-to-t from-amber-50 to-white"
        // Uncomment if you want image bg:
        // style={{
        //   backgroundImage: `url(${lightbg.src})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-black tracking-tight">
          Bring Elegance to Your Home
        </h2>
        <p className="max-w-xl mx-auto text-base md:text-lg text-gray-600 mb-8">
          SK Wooden Fancy Lamps brings warmth, style, and craftsmanship to your
          living space. Explore our exquisite lamp collections today.
        </p>
        <button onClick={()=>{
          router.push('/Home/Collections')
        }} className="bg-gradient-to-r cursor-pointer from-amber-600 to-amber-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-amber-800 transition-all duration-700">
          Shop Now
        </button>
      </div>
    </main>
  );
}
