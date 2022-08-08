// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  async rewrites() {
    return [];
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 300, // 초 단위, 5분 적용(기본은 1분)
  images: {
    domains: ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  webpack(conf) {
    conf.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                {
                  // Enable figma's wrong mask-type attribute work
                  removeRasterImages: false,
                  removeStyleElement: false,
                  removeUnknownsAndDefaults: false,
                  // Enable svgr's svg to fill the size
                  removeViewBox: false
                }
              ]
            }
          }
        }
      ]
    });
    // 절대경로
    conf.resolve.modules.push(__dirname);
    return conf;
  }
});
