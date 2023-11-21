// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');
const isProduction = process.env.NODE_ENV === 'production';
const debugLogs = process.env.DEBUG_LOGS === 'true';
const enableProgressiveWebApp = process.env.ENABLE_PROGRESSIVE_WEB_APP === 'true';

try {
  if (!process.env.NOTION_API_SECRET_KEY) {
    throw 'NOTION_API_SECRET_KEY';
  }
  if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID) {
    throw 'NEXT_PUBLIC_NOTION_DATABASE_ID';
  }
  if (!process.env.NEXT_PUBLIC_INFOMATION_BLOGNAME) {
    throw 'NEXT_PUBLIC_INFOMATION_BLOGNAME';
  }
  if (!process.env.NEXT_PUBLIC_INFOMATION_ORIGIN) {
    throw 'NEXT_PUBLIC_INFOMATION_ORIGIN';
  } else {
    try {
      new URL(process.env.NEXT_PUBLIC_INFOMATION_ORIGIN);
    } catch (e) {
      throw 'NEXT_PUBLIC_INFOMATION_ORIGIN';
    }
  }
} catch (err) {
  if (typeof err === 'string') {
    const message = `The environment variable \`${err}\` is required. Please check the \`/.env.example\` and correct it.`;
    console.log('\x1b[37m\x1b[41m');
    console.log('ERROR - ' + message, '\x1b[0m');
    throw `\`${err}\` is invalide value`;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}'
    }
  },
  staticPageGenerationTimeout: 600, // 초 단위, 10분 적용(기본은 1분)
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      's3.us-west-2.amazonaws.com',
      's3-us-west-2.amazonaws.com',
      'images.unsplash.com'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 1800
  },
  async rewrites() {
    return [
      {
        source: '/aws-secure-notion-static/:path*',
        destination: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/:path*'
      },
      {
        source: '/aws-public-notion-static/:path*',
        destination: 'https://s3.us-west-2.amazonaws.com/public.notion-static.com/:path*'
      },
      {
        source: '/aws-files-secure-notion-static/:path*',
        destination: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/:path*'
      }
    ];
  }
};

module.exports = enableProgressiveWebApp
  ? withPWA({
      dest: 'public',
      disable: !isProduction,
      disableDevLogs: debugLogs,
      runtimeCaching: []
    })(nextConfig)
  : nextConfig;
