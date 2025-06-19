/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://48.210.58.7:3001',
  },
  experimental: {},
  webpack: (config) => {
    return config;
  },
}

export default nextConfig 