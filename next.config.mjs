/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // 🔹 needed because Next image optimization requires a Node server
    domains: ["pub-24b0ef26a7c548cd9d5acf28fe538193.r2.dev"],
  },
};

export default nextConfig;
