import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const csp =
  "default-src 'self'; " +
  "img-src 'self' data: https://ohykyqivksptnixjsnvs.supabase.co https://images.unsplash.com https://res.cloudinary.com https://lmresources.razorpay.com https://cdn.razorpay.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://checkout.razorpay.com https://cdn.razorpay.com; ` +
  "font-src 'self' data: https://fonts.gstatic.com; " +
  "connect-src 'self' https://ohykyqivksptnixjsnvs.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com; " +
  "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com; " +
  "frame-ancestors 'none';";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ohykyqivksptnixjsnvs.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: csp.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;