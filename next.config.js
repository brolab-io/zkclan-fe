/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["ipfs.w3s.link"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  output: "standalone",
};

module.exports = nextConfig;
