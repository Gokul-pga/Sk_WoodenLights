"use client";
import React from "react";
import Image from "next/image";
import { FaShoppingCart, FaTrash, FaHeart, FaStar, FaTags } from "react-icons/fa";

// --- START: REUSABLE ASSETS AND DATA (Adjust these imports as needed) ---
import lamp1 from "../../assets/lamp-light-1.jpg";
import lamp2 from "../../assets/lamp-light-2.jpg";
import lamp3 from "../../assets/lamp-light-3.jpg";
import { Colors } from "@/config/colors";

// Data using local imports for images
const wishlistData = [
  {
    id: "W001",
    name: "Classic Leather Backpack",
    price: "₹3,999",
    oldPrice: "₹5,000",
    image: lamp1,
    inStock: true,
    addedDate: "2025-08-10",
    rating: 4.5,
  },
  {
    id: "W002",
    name: "Noise Cancelling Headphones",
    price: "₹12,499",
    oldPrice: "₹15,000",
    image: lamp2,
    inStock: false, // Out of stock example
    addedDate: "2025-09-01",
    rating: 4.8,
  },
  {
    id: "W003",
    name: "Minimalist Desk Lamp",
    price: "₹1,450",
    oldPrice: null,
    image: lamp3,
    inStock: true,
    addedDate: "2025-09-20",
    rating: 4.2,
  },
];
// --- END: REUSABLE ASSETS AND DATA ---


function MyWishlist() {

  // Placeholder action handlers
  const handleRemove = (itemId) => {
    alert(`Removed item ${itemId} from wishlist.`);
  };

  const handleAddToCart = (itemId) => {
    alert(`Added item ${itemId} to cart!`);
  };

  return (
    <div className="w-full space-y-8">
      <h2 style={{ color: Colors.primaryColorDark }} className={`text-4xl font-extrabold tracking-tight border-b pb-4 mb-4 flex items-center gap-3`}>
        <FaHeart className="text-3xl" style={{ color: Colors.primaryColor }} /> My Wishlist
      </h2>

      {wishlistData.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">Your wishlist is empty! Start saving your favorite items.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlistData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-center bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 relative"
            >
              {/* 1. Product Image */}
              <div className="w-full md:w-32 h-32 relative flex-shrink-0 mb-4 md:mb-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="128px"
                  className="object-cover rounded-lg border border-gray-100"
                />
              </div>

              {/* 2. Product Details */}
              <div className="flex-1 p-0 md:pl-6">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FaStar className="text-amber-400 mr-1" />
                  <span className="font-medium">{item.rating}</span>
                  <span className="mx-2">|</span>
                  <span className="text-sm">Added: {item.addedDate}</span>
                </div>

                {/* Price & Status */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span style={{ color: Colors.primaryColorDark }} className={`text-2xl font-bold`}>{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-gray-400 line-through text-md">{item.oldPrice}</span>
                  )}
                  {/* Stock Status Badge (Kept standard colors for quick recognition) */}
                  <div
                    className={`ml-4 text-xs font-bold px-2 py-1 rounded-full ${
                      item.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                  </div>
                </div>
              </div>

              {/* 3. Actions */}
              <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 md:ml-4">
                <button
                  onClick={() => handleAddToCart(item.id)}
                  disabled={!item.inStock}
                  style={{ 
                    backgroundColor: item.inStock ? Colors.primaryColor : '#d1d5db', // Gray for disabled
                    color: item.inStock ? 'white' : '#6b7280' 
                  }}
                  className={`px-5 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                    item.inStock
                      ? `hover:bg-[#7a1717] shadow-[#a52a2a]/30`
                      : "cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all duration-200"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWishlist;