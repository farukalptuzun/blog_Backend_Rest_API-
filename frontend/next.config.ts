import type { NextConfig } from "next";

/** Express backend (Next /api ve /uploads isteklerini buraya yönlendirir). .env.local içinde BACKEND_URL ile değiştir. */
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
