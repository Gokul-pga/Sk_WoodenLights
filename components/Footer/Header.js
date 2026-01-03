"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-yellow-600 text-white text-sm py-2 text-center">
        Free shipping on orders above $200 ✨
      </div>

      {/* Main Nav */}
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-yellow-600 tracking-wide">
          LightsStore
        </Link>

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search for lights..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="bg-yellow-600 px-4 flex items-center justify-center text-white hover:bg-yellow-700">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <Link href="/wishlist" className="relative hover:text-yellow-600">
            <HeartIcon className="h-6 w-6" />
          </Link>
          <Link href="/cart" className="relative hover:text-yellow-600">
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-1 rounded-full">
              2
            </span>
          </Link>
          <Link href="/account" className="hover:text-yellow-600">
            <UserIcon className="h-6 w-6" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Categories Bar (Desktop only) */}
      <div className="hidden md:flex justify-center bg-gray-50 border-t border-gray-200">
        <nav className="flex gap-8 py-3 text-gray-700 font-medium">
          <Link href="/collections" className="hover:text-yellow-600">All Lights</Link>
          <div
            className="relative group"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-yellow-600">
              Categories <ChevronDownIcon className="h-4 w-4" />
            </button>
            {categoriesOpen && (
              <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg w-56 p-4 grid gap-2">
                <Link href="/collections/pendant" className="hover:text-yellow-600">Pendant Lights</Link>
                <Link href="/collections/chandelier" className="hover:text-yellow-600">Chandeliers</Link>
                <Link href="/collections/wall" className="hover:text-yellow-600">Wall Lamps</Link>
                <Link href="/collections/table" className="hover:text-yellow-600">Table Lamps</Link>
                <Link href="/collections/floor" className="hover:text-yellow-600">Floor Lamps</Link>
              </div>
            )}
          </div>
          <Link href="/about" className="hover:text-yellow-600">About</Link>
          <Link href="/contact" className="hover:text-yellow-600">Contact</Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
          <Link href="/collections" onClick={() => setMenuOpen(false)}>All Lights</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-1">
            <ShoppingCartIcon className="h-5 w-5" /> Cart
          </Link>
          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-1">
            <HeartIcon className="h-5 w-5" /> Wishlist
          </Link>
          <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-1">
            <UserIcon className="h-5 w-5" /> Account
          </Link>
        </div>
      )}
    </header>
  );
}
