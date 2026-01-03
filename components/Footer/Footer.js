"use client";
import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Home,
  Users,
  MessageSquareText,
  Instagram,
  Facebook,
} from "lucide-react";
import logo from "../../assets/SK_Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const Footer = () => {
  const router = useRouter();
  const quickLinks = [
    { name: "Collections", href: "/Home/Collections", icon: Home },
    { name: "About Us", href: "/Home/AboutUs", icon: Users },
    { name: "Contact", href: "/Home/ContactUs", icon: Mail },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
      color: "text-blue-700",
      bg: "#3b5998",
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
      color: "text-pink-600",
      bg: "#e95950",
    },
    {
      name: "WhatsApp",
      href: "#",
      icon: MessageSquareText,
      color: "text-green-600",
      bg: "#25D366",
    },
  ];

  return (
    <footer
      className="bg-gray-50 text-gray-800 py-16 shadow-2xl"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 230, 0.6), rgba(255, 255, 255, 1))",
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 border-b border-gray-200 pb-12">
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src={logo}
                alt="SK Wooden Fancy Lights Logo"
                className="w-32  rounded-lg object-cover shadow-xl transition duration-300 hover:scale-[1.03] cursor-pointer bg-black p-2"
                onClick={() => router.push("/Home")}
              />
            </div>

            <h3 className="text-4xl font-extrabold text-gray-900 mb-4 font-serif">
              SK Fancy Lights
            </h3>

            <p className="text-gray-600 text-base leading-relaxed pr-0 lg:pr-12">
              We specialize in craftsmanship, offering unique **wooden lamps**
              that infuse any room with natural **warmth and a soft, inviting
              glow**. Discover the perfect piece to illuminate and elevate your
              home aesthetic.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-yellow-700 pl-3 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center group text-gray-600 hover:text-yellow-700 font-medium transition duration-200 hover:translate-x-1"
                  >
                    <link.icon className="w-4 h-4 mr-3 text-yellow-600 opacity-80 group-hover:opacity-100" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-yellow-700 pl-3 uppercase tracking-wider">
              Connect With Us
            </h4>

            <div className="space-y-3 text-sm">
              <p className="flex items-start text-gray-600">
                <MapPin className="w-4 h-4 mr-3 mt-1 text-yellow-700 flex-shrink-0" />
                <span>Ulliyeri, Kozhikode, Kerala, India</span>
              </p>
              <p className="flex items-center group text-gray-600">
                <Phone className="w-4 h-4 mr-3 text-yellow-700 flex-shrink-0" />
                <a
                  href="tel:+919447911947"
                  className="hover:text-gray-900 transition duration-200"
                >
                  +91 94479 11947 / 94962 34766
                </a>
              </p>
              <p className="flex items-center group text-gray-600">
                <Mail className="w-4 h-4 mr-3 text-yellow-700 flex-shrink-0" />
                <a
                  href="mailto:support@skwoodenfancylights.com"
                  className="hover:text-gray-900 transition duration-200"
                >
                  support@skwoodenfancylights.com
                </a>
              </p>
            </div>

            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl shadow-lg transition duration-300 ease-in-out hover:scale-105"
                  style={{ backgroundColor: social.bg }}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 text-sm text-gray-600 font-medium">
          <p>
            © {new Date().getFullYear()} **SK Wooden Fancy Lights** — All rights
            reserved.
            <span className="block mt-1 text-xs text-gray-500">
              Illuminating your space with handcrafted excellence.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
