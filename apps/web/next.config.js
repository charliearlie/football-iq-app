/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@football-iq/database'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
