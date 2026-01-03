"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/app/envfile/api";

export default function ProductsByCategory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategory, setSubcategory] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState(null);

  const router = useRouter();

  // Get query params safely on the client
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get("category");
    const name = searchParams.get("name");

    setSubcategory(category);
    setSubcategoryName(name);
  }, []);

  // Fetch products after subcategory is available
  useEffect(() => {
    if (!subcategory) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const body = { subcategory: { recordId: subcategory } };
        const res = await axios.post(`${api}/api/products/filter`, body);

        if (res.data.success) setProducts(res.data.data);
        else setProducts([]);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subcategory]);

  return (
    <div className="min-h-screen bg-[#fef9f5] py-12 px-4 sm:px-10 md:px-16">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">
        {subcategoryName
          ? `${subcategoryName} Category`
          : "Browse Our Product Collections"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No products found for <b>{subcategoryName}</b>.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl shadow hover:shadow-lg transition p-4 bg-white flex flex-col cursor-pointer"
              onClick={() => router.push(`/Home/ProductListing/${item.slug}`)}
            >
              <div className="relative w-full h-[220px]">
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.identifier}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              <div className="mt-4 flex flex-col flex-1">
                <div className="text-lg font-semibold text-gray-800">
                  {item.identifier}
                </div>
                <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {item.description}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-red-600">
                      ₹{item.discountPrice}
                    </span>
                    <span className="text-md text-gray-500 line-through">
                      ₹{item.price}
                    </span>
                  </div>
                  {item.discountPrice < item.price && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      {Math.round(
                        ((item.price - item.discountPrice) / item.price) * 100
                      )}
                      % OFF
                    </span>
                  )}
                </div>

                <button
                  className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/Home/ProductListing/${item.slug}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
