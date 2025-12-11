/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Explicitly disable Turbopack
    enabled: false,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_BACKEND_URL
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
          : "https://sbackend.duckdns.org/api/:path*",
      },
    ];
  },

  webpack(config) {
    return config;
  },
};

export default nextConfig;
