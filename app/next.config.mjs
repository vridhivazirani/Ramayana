/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Leaflet accesses `window` at import time; disable these in server context
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
