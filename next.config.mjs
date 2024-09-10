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
  async rewrites() {
    return [
      {
        source: '/sign-in/:path*',
        destination: '/sign-in',
      },
      {
        source: '/sign-up/:path*',
        destination: '/sign-up',
      },
    ];
  },
};

export default nextConfig;
