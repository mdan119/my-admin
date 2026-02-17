import type { NextConfig } from "next";

const MAX_LIMIT = 5 * 1024 * 1024; // 5MB dalam Bytes

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Set lebih besar dari maxSizeMB komponenmu (misal 4MB)
    },
  },
  env: {
    SERVER_MAX_UPLOAD_SIZE: MAX_LIMIT.toString(), // Kirim ke environment agar bisa dibaca kode
  }
};

export default nextConfig;
