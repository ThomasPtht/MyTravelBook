import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Permet des payloads jusqu'à 5 Mo
    },
  },
};

export default nextConfig;
