import { siteConfig } from 'src/lib/siteConfig';

const config = siteConfig({
  origin: process.env.NEXT_PUBLIC_BASE_API_ORIGIN || 'https://sooros.com',
  path: process.env.NEXT_PUBLIC_BASE_API_PATH || '/api/v1',
  notion: {
    baseBlock: process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK || 'cd9c83dd9ea14181854cced99bac68c6',
    secretKey: process.env.NOTION_API_SECRET_KEY || '',
    customDomain: process.env.NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN || null
  },
  TZ: 'Asia/Seoul'
});

export default config;

export const NEXT_IMAGE_DOMAINS = ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'];
