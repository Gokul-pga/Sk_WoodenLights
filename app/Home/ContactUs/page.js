"use client";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactUs() {
  const controls = useAnimation();
  const [glow, setGlow] = useState(true);
  const [lightOn, setLightOn] = useState(false);

  const handlePull = async () => {
    await controls.start({
      y: 60,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    });
    setGlow(true);
    await controls.start({
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 8 },
    });
    setTimeout(() => setGlow(false), 3000);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "310dd7ba-767d-4b79-a344-d7f7a607790b",
          subject: "New Contact Enquiry - SK Lights",
          from_name: "SK Wooden Fancy Lights",
          ...formData,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Message sent successfully!");
        setStatus("Message sent successfully ✅");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setStatus("Failed to send message ❌");
      }
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong ❌");
    }
  };
  return (
    <section
      className={`relative min-h-screen py-16 px-6 md:px-20 transition ${
        glow ? "bg-yellow-50" : "bg-[#000]"
      }`}
    >
      {/* Glow effect */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[600px] pointer-events-none 
          bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.8)_0%,rgba(250,204,21,0.5)_20%,rgba(250,204,21,0.2)_50%,transparent_80%)] 
          blur-[40px] transition-opacity duration-700 ${
            lightOn ? "opacity-100" : "opacity-0"
          }`}
      ></div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1
          className={`text-4xl md:text-5xl font-extrabold ${
            !glow ? "text-white" : "text-gray-800"
          }`}
        >
          Get in <span className="text-red-600">Touch</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about our lights or want to place a custom order? We’d
          love to hear from you. Fill out the form or reach us directly.
        </p>
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send Us a Message
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <textarea
              rows={5}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition shadow-lg"
            >
              Send Message
            </button>

            {status && (
              <p className="text-center text-sm mt-3 text-gray-700">{status}</p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-between">
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Contact Information
            </h2>
            <ul className="space-y-5 text-gray-700">
              <li className="flex items-center gap-4">
                <MapPinIcon className="h-6 w-6 text-red-600" />
                <span>Ulliyeri, Kozhikode, Kerala</span>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon className="h-6 w-6 text-red-600" />
                <span>+91 94479 11947 / 94962 34766</span>
              </li>
              <li className="flex items-center gap-4">
                <EnvelopeIcon className="h-6 w-6 text-red-600" />
                <span>support@skwoodenfancylights.com</span>
              </li>
              <li className="flex items-center gap-4">
                <ClockIcon className="h-6 w-6 text-red-600" />
                <span>
                  Mon – Sat: 9:30 AM – 8:00 PM <br /> Sunday: Closed
                </span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=Ulliyeri,+Kozhikode,+Kerala,+India&output=embed"
              width="100%"
              height="300"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Extra Section: Visit Our Store */}
      <div className="mt-20 text-center bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800">Visit Our Store</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Experience the beauty of our handcrafted lights in person. Our store
          features the latest designs and custom options tailored for your home.
        </p>
        <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
          Get Directions
        </button>
      </div>

      {/* Highlights / Socials */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800">Custom Orders</h3>
          <p className="text-gray-600 mt-2">
            Tailor-made lighting solutions crafted for your space.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800">24/7 Support</h3>
          <p className="text-gray-600 mt-2">
            Always available to answer your questions and assist you.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Trusted by Customers
          </h3>
          <p className="text-gray-600 mt-2">
            Over 1,000+ happy customers across Kerala.
          </p>
        </div>
      </div>
    </section>
  );
}
