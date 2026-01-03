"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { useState, useEffect } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} bg-white text-foreground relative`}
    >
      <Toaster/>
      <Navbar />
      <div className="min-h-screen mx-auto">{children}</div>
      <Footer />

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 cursor-pointer right-6 p-3 bg-[#A52A2A] text-white rounded-full shadow-xl 
                     hover:shadow-2xl hover:scale-110 hover:translate-y-[-3px] transition-all duration-300 animate-bounce z-50"
          title="Scroll to top"
        >
          <IoIosArrowUp />
        </button>
      )}
    </div>
  );
}
