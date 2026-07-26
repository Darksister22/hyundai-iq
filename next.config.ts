import type { NextConfig } from "next";
const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname;

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.16.152.149', '192.168.56.1', '192.168.68.101', '169.254.233.67'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/public/**",
      }
    ]
  }
};
export default nextConfig;
