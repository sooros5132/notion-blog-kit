import { siteConfig } from 'src/lib/siteConfig';

const config = siteConfig({
  TZ: 'Asia/Seoul',
  origin: process.env.NEXT_PUBLIC_BASE_API_ORIGIN || 'https://sooros.com',
  path: process.env.NEXT_PUBLIC_BASE_API_PATH || '/api/v1',
  notion: {
    baseBlock: process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK || 'cd9c83dd9ea14181854cced99bac68c6',
    secretKey: process.env.NOTION_API_SECRET_KEY || '',
    customDomain: process.env.NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN || null
  },
  headerNav: [
    {
      name: '카테고리',
      url: `${process.env.NEXT_PUBLIC_BASE_API_ORIGIN}/dec967958ca74abeb493942f923100f7`
    },
    {
      name: '세팅',
      url: `${process.env.NEXT_PUBLIC_BASE_API_ORIGIN}/e4b50b569ffb44e9bec7f71bd29fb23b`
    }
  ]
});

export default config;

export const NEXT_IMAGE_DOMAINS = ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'];
