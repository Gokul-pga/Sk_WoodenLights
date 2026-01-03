"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import bgLamp from "../../../assets/lamp-light-9.jpg";

export default function Signup() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row bg-white/40 backdrop-blur-xl"
      >
        {/* Left Side - Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative md:w-1/2 hidden md:block"
        >
          <Image
            src={bgLamp}
            alt="Lamp"
            className="object-cover h-full w-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center px-6">
              Join Us <br /> and Light Up Your Home
            </h1>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center px-10 py-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Sign Up
          </h2>
          <p className="text-gray-600 mb-8">
            Create your account to start shopping.
          </p>

          <form className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#a52a2a] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#a52a2a] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#a52a2a] focus:outline-none"
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#a52a2a] hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-md transition-colors"
            >
              Sign Up
            </motion.button>
          </form>

          {/* Login */}
          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#a52a2a] font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
