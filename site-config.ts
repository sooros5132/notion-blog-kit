import { siteConfig } from 'src/lib/siteConfig';

const config = siteConfig({
  TZ: 'Asia/Seoul',
  origin: process.env.NEXT_PUBLIC_BASE_ORIGIN || 'https://blog.sooros.com',
  path: '/api/v1',
  notion: {
    baseBlock: process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK || 'cd9c83dd9ea14181854cced99bac68c6',
    customDomain: process.env.NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN || null
  },
  infomation: {
    nickname: process.env.NEXT_PUBLIC_INFOMATION_NICKNAME || 'sooros',
    email: process.env.NEXT_PUBLIC_INFOMATION_EMAIL,
    github: process.env.NEXT_PUBLIC_INFOMATION_GITHUB,
    repository: process.env.NEXT_PUBLIC_INFOMATION_REPOSITORY
  },
  googleGTag: process.env.NEXT_PUBLIC_GOOGLE_G_TAG
});

export default config;

export const NEXT_IMAGE_DOMAINS = ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'];
