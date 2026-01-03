"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

// 🔹 Assets
import bgLamp from "../../assets/aboutus-img-1.jpg";
import SKLogo from "../../assets/SK_Logo.png";
import { api } from "../envfile/api";

/* --------------------- OTP INPUT COMPONENT --------------------- */
function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value ? value.charAt(value.length - 1) : "";
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.join("").length === length && !newOtp.includes("")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, length);
    if (!/^[0-9]+$/.test(pasteData)) return;
    const newOtp = pasteData.split("");
    while (newOtp.length < length) newOtp.push("");
    setOtp(newOtp);
    onComplete(newOtp.join(""));
    inputsRef.current[length - 1]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/90 text-gray-800 shadow focus:ring-2 focus:ring-[#a52a2a] focus:outline-none transition-all"
        />
      ))}
    </div>
  );
}

/* --------------------- MAIN AUTH PAGE --------------------- */
export default function AuthPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();

  /* Countdown logic */
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  /* Send OTP API */
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Sending OTP to:", email);

      const res = await axios.post(`${api}/api/auth/login`, {
        email,
      });
      console.log("✅ OTP Send Response:", res.data);

      if (res.data.success) {
        toast.success("OTP sent successfully!");
        setStep("otp");
        setResendTimer(res.data.data?.canResendAfter || 30);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("❌ Send OTP Error:", err);
      toast.error("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      console.log("📥 Verifying OTP for:", email, "OTP:", otp);

      const res = await axios.post(`${api}/api/auth/verify-otp`, {
        email,
        otp,
      });

      console.log("✅ Verify OTP Response:", res.data);

      if (res.data.success) {
        toast.success("Login successful 🎉");

        const token = res?.data?.data?.jwtToken; // ✅ FIXED
        const user = res?.data?.data?.user;

        if (typeof window !== "undefined" && token && user) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isLoggedIn", "true");
          console.log("✅ Token & user stored:", token, user);
        }

        setTimeout(() => {
          router.push("/Home");
        }, 1000);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("❌ Verify OTP Error:", err);
      toast.error("Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------- UI --------------------- */
  return (
    <main className="relative min-h-screen flex items-center justify-start px-5">
      {/* 🔹 Background */}
      <Image
        src={bgLamp}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/25" />
      <Toaster />

      {/* 🔹 Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-transparent shadow-xl p-8 border border-gray-200 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src={SKLogo}
            alt="SK Logo"
            width={140}
            height={140}
            className="mb-4"
          />

          <AnimatePresence mode="wait">
            {/* STEP 1: ENTER EMAIL */}
            {step === "email" ? (
              <motion.div
                key="email-step"
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
                <p className="text-white/90 mb-6 text-sm">
                  Enter your email to continue.
                </p>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="text-left">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[#a52a2a] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#a52a2a] hover:bg-[#8b1c1c] text-white"
                    }`}
                  >
                    {loading ? "Sending OTP..." : "Continue"}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* STEP 2: VERIFY OTP */
              <motion.div
                key="otp-step"
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  Verify OTP
                </h2>
                <p className="text-white/90 mb-6 text-sm">
                  We sent a code to{" "}
                  <span className="font-medium text-[#f9c74f]">{email}</span>.
                  Please enter it below.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-center">
                    <OtpInput length={6} onComplete={(code) => setOtp(code)} />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#a52a2a] hover:bg-[#8b1c1c] text-white"
                    }`}
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-3 text-sm">
                  <p className="text-white/80">
                    Wrong email?{" "}
                    <button
                      onClick={() => setStep("email")}
                      className="text-[#f9c74f] hover:text-[#ffd166] font-medium transition"
                    >
                      Change
                    </button>
                  </p>

                  <div className="text-white/80">
                    Didn’t get the code?{" "}
                    <button
                      onClick={handleSendOtp}
                      disabled={resendTimer > 0}
                      className={`font-medium ${
                        resendTimer > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#f9c74f] hover:text-[#ffd166] transition"
                      }`}
                    >
                      {resendTimer > 0
                        ? `Resend in ${resendTimer}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
