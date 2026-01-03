// "use client";

// import { useState } from "react";
// import Image from "next/image";

// // ✅ Import all images
// // import lamp1 from "../../../assets/lamp-light-1.jpg";
// // import lamp2 from "../../../assets/lamp-light-2.jpg";
// // import lamp3 from "../../../assets/lamp-light-3.jpg";
// // import lamp4 from "../../../assets/lamp-light-4.jpg";
// // import lamp5 from "../../../assets/lamp-light-5.jpg";
// // import lamp6 from "../../../assets/lamp-light-6.png";
// // import lamp7 from "../../../assets/lamp-light-7.jpg";
// // import lamp8 from "../../../assets/lamp-light-8.jpg";
// // import lamp9 from "../../../assets/lamp-light-9.jpg";
// // import lamp10 from "../../../assets/lamp-light-10.jpg";
// import img1 from "../../../assets/Pendant Light/img1.png";
// import img2 from "../../../assets/Box Wooden Hanging Lamp/img4.png";
// import img3 from "../../../assets/Hexagonal Pendant Light/img1.png";
// import img4 from "../../../assets/Wooden Wall Sconce/img4.png";
// import img5 from "../../../assets/wooden wall lantern/img1.png";

// import listimg2 from "../../../assets/Pendant Light/img2.png";
// import listimg3 from "../../../assets/Pendant Light/img3.png";
// import listimg4 from "../../../assets/Pendant Light/img4.png";
// import listimg5 from "../../../assets/Pendant Light/img5.jpeg";

// import wallLamp from "../../../assets/wall-lamp.webp";
// import ceilingLamp from "../../../assets/Ceiling-Lamp.webp";
// import tableLamp from "../../../assets/Table-Lamp.jpg";
// import pendantLamp from "../../../assets/Pendan-tLamp.jpg";
// import { useRouter } from "next/navigation";
// const product = {
//   title: "Handmade Wooden Lamp",
//   description:
//     "A beautifully handcrafted wooden lamp made with sustainable teak wood. Adds warmth and elegance to your living room or bedroom.",
//   price: 2999,
//   discountPrice: 1999,
//   images: [img1, listimg2, listimg3, listimg4,listimg5],
// };

// // ✅ Product Listing Data
// const products = [
//   {
//     id: 1,
//     name: "Box Wooden Hanging Lamp",
//     description: "Elegant wooden hanging lamp with a box-style design, perfect for warm interiors.",
//     price: 2799,
//     image: img2,
//     onSale: true,
//     rating: 4.4,
//     boughtCount: 150,
//   },
//   {
//     id: 2,
//     name: "Hexagonal Pendant Light",
//     description: "Unique hexagonal pendant light that adds a modern touch to any room.",
//     price: 3199,
//     image: img3,
//     onSale: false,
//     rating: 4.2,
//     boughtCount: 95,
//   },
//   {
//     id: 3,
//     name: "Pendant Light",
//     description: "Classic pendant light design, versatile for living or dining spaces.",
//     price: 2499,
//     image: img1,
//     onSale: true,
//     rating: 4.0,
//     boughtCount: 180,
//   },
//   {
//     id: 4,
//     name: "Wooden Wall Lantern",
//     description: "Rustic wooden lantern that mounts to the wall, ideal for cozy ambience.",
//     price: 2899,
//     image: img5,
//     onSale: true,
//     rating: 4.5,
//     boughtCount: 120,
//   },
//   {
//     id: 5,
//     name: "Wooden Wall Sconce",
//     description: "Stylish wooden wall sconce that provides a warm and modern glow.",
//     price: 2399,
//     image: img4,
//     onSale: false,
//     rating: 4.3,
//     boughtCount: 105,
//   },
// ];

// const collections = [
//     {
//       id: 1,
//       name: "Wall Lamps",
//       description: "Stylish wall lamps to create cozy vibes.",
//       image: wallLamp,
//       link: "/collections/wall-lamps",
//     },
//     {
//       id: 2,
//       name: "Ceiling Lamps",
//       description: "Brighten your home with modern ceiling lamps.",
//       image: ceilingLamp,
//       link: "/collections/ceiling-lamps",
//     },
//     {
//       id: 3,
//       name: "Table Lamps",
//       description: "Perfect companions for bedside & study spaces.",
//       image: tableLamp,
//       link: "/collections/table-lamps",
//     },
//     {
//       id: 4,
//       name: "Pendant Lamps",
//       description: "Add elegance with stylish pendant lamps.",
//       image: pendantLamp,
//       link: "/collections/pendant-lamps",
//     },
//   ];

// export default function ProductDetails() {
//   const router = useRouter();
//   const [selectedImage, setSelectedImage] = useState(product.images[0]);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [isZooming, setIsZooming] = useState(false);

//   const handleMouseMove = (e) => {
//     const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPosition({ x, y });
//   };
//   return (
//     <div className="max-w-6xl mx-auto p-8">
//       {/* ✅ Main Product Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
//         {/* Left Side - Images */}
//         <div>
//           {/* Main Preview */}
//           <div
//         className="w-full h-[450px] border rounded-xl shadow-md flex items-center justify-center bg-white overflow-hidden relative"
//         onMouseMove={handleMouseMove}
//         onMouseEnter={() => setIsZooming(true)}
//         onMouseLeave={() => setIsZooming(false)}
//       >
//         <Image
//           src={selectedImage}
//           alt="Product Preview"
//           width={800}
//           height={1200}
//           className="object-contain w-full h-full rounded-xl"
//         />
//       </div>

//       {isZooming && (
//         <div className="w-[400px] h-[450px] hidden lg:flex border rounded-xl shadow-lg bg-white absolute top-24 right-5 overflow-hidden">
//           <Image
//             src={selectedImage}
//             alt="Zoom Preview"
//             width={800}
//             height={1200}
//             className="w-full h-full object-cover"
//             style={{
//               transform: `scale(2) translate(-${zoomPosition.x}%, -${zoomPosition.y}%)`,
//               transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
//               transition: "transform 0.05s ease-out",
//             }}
//           />
//         </div>
//       )}

//           {/* Thumbnail Gallery */}
//           <div className="flex gap-4 mt-4">
//             {product.images.map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelectedImage(img)}
//                 className={`border rounded-lg p-1 ${
//                   selectedImage === img ? "border-red-600" : "border-gray-300"
//                 }`}
//               >
//                 <Image
//                   src={img}
//                   alt={`Thumbnail ${idx}`}
//                   width={80}
//                   height={80}
//                   // fill
//                   className="object-cover w-20 h-20 rounded-lg"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right Side - Product Info */}
//         <div className="flex flex-col justify-start">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             {product.title}
//           </h1>
//           <p className="text-gray-600 mb-6">{product.description}</p>

//           {/* Pricing */}
//           <div className="flex items-center gap-4 mb-6">
//             <span className="text-3xl font-bold text-red-600">
//               ₹{product.discountPrice}
//             </span>
//             <span className="text-lg text-gray-500 line-through">
//               ₹{product.price}
//             </span>
//             <span className="text-green-600 font-semibold">
//               {Math.round(
//                 ((product.price - product.discountPrice) / product.price) * 100
//               )}
//               % OFF
//             </span>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex gap-4">
//   {product.stock === 0 ? (
//     <>
//       <button
//         onClick={() => router.push("/Home/Cart")}
//         className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
//       >
//         Add to Cart
//       </button>
//       <button className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition">
//         Buy Now
//       </button>
//     </>
//   ) : (
//     <div className="text-gray-500 font-semibold px-6 py-3 rounded-lg bg-gray-100">
//       Currently Unavailable
//     </div>
//   )}
// </div>

//         </div>
//       </div>

//       {/* ✅ Product Listing Section */}
//       <h2 className="text-2xl font-bold mb-6">More Products</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {products.map((item,index) => (
//           <div
//             key={index}
//             className="border rounded-xl shadow hover:shadow-lg transition p-4 bg-white flex flex-col"
//           >
//             <Image
//               src={item.image}
//               alt={item.name}
//               width={300}
//               height={200}
//               className="rounded-lg object-cover w-full h-[300px]"
//             />
//             <h3 className="text-lg font-semibold mt-4">{item.name}</h3>
//             <p className="text-gray-600 text-sm mt-2 line-clamp-2">
//               {item.description}
//             </p>
//             <div className="flex items-center justify-between mt-4">
//               <span className="text-red-600 font-bold">₹{item.price}</span>
//               {item.onSale && (
//                 <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
//                   On Sale
//                 </span>
//               )}
//             </div>
//             <div className="mt-2 text-sm text-gray-500">
//               ⭐ {item.rating} | Bought {item.boughtCount}+ times
//             </div>
//             <button className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="max-w-6xl mx-auto py-16">
//       <h2 className="text-2xl font-bold mb-8 text-center">
//         Want to Explore More?
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {collections.map((col,index) => (
//           <div
//             key={index}
//             // href={col.link}
//             className="relative group overflow-hidden rounded-xl shadow-lg"
//           >
//             {/* Image */}
//             <Image
//               src={col.image}
//               alt={col.name}
//               width={400}
//               height={400}
//               className="object-cover w-full h-64 transform group-hover:scale-105 transition duration-500"
//             />

//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black/60 translate-y-full group-hover:translate-y-0 transition duration-500 flex items-center justify-center">
//               <span className="text-white text-lg font-semibold">
//                 {col.name}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//     </div>
//   );
// }

import React from "react";

function page() {
  return <div>page</div>;
}

export default page;
