"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api } from "@/app/envfile/api";
import Image from "next/image";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartStatus, setCartStatus] = useState({}); // Track added products
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${api}/api/products/get`);
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("authToken"); // check for token
    if (!token) {
      router.push("/login"); // navigate to login if not logged in
      return;
    }

    try {
      const res = await axios.post(
        `${api}/cart/add`, // replace with your actual cart API
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCartStatus((prev) => ({ ...prev, [productId]: true })); // mark as added
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  return (
    <div className="px-6 md:px-16 py-10">
      <div className="text-center mb-8">
        <div className="text-3xl md:text-4xl font-extrabold text-gray-800">
          🛋️ All Products
        </div>
        <div className="text-gray-500 mt-2 text-lg">
          Explore our full collection of beautiful wooden lamps.
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() =>
                router.push(`/Home/ProductListing/${product.slug}`)
              }
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              {/* Sale Tag */}
              {product.discountPrice < product.price && (
                <span className="absolute z-50 mt-3 ml-3 bg-[#A52A2A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  SALE
                </span>
              )}

              {/* Product Image */}
              <div className="relative bg-gray-50 h-60 flex items-center justify-center">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="max-h-52 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-red-600 transition">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold text-red-600">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    ₹{product.price}
                  </span>
                </div>

                {/* Add to Cart */}
                <button
                  className={`mt-5 w-full py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg ${
                    cartStatus[product._id]
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-[#A52A2A] text-white hover:bg-red-700"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!cartStatus[product._id]) handleAddToCart(product._id);
                  }}
                >
                  {cartStatus[product._id] ? "Added to Cart" : "🛒 Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
