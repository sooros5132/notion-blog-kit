/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // experimental: {
  //   appDir: true
  // },
  staticPageGenerationTimeout: 300, // 초 단위, 5분 적용(기본은 1분)
  images: {
    domains: ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 1800
  },
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig;
