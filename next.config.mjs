/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This will allow images from any hostname using HTTPS
      },
      {
        protocol: 'http',
        hostname: '**', // This will allow images from any hostname using HTTP
      },
    ],
  },
}

export default nextConfig;
