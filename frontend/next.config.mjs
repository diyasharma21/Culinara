/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
    serverActions: {
      bodySizeLimit: "10mb", // increase from 1mb → 5mb
    }, // defaults to true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themealdb.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  
};

export default nextConfig;