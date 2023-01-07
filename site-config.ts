import { siteConfig } from 'src/lib/siteConfig';

const config = siteConfig({
  TZ: 'Asia/Seoul',
  origin: process.env.NEXT_PUBLIC_BASE_API_ORIGIN || 'https://sooros.com',
  path: process.env.NEXT_PUBLIC_BASE_API_PATH || '/api/v1',
  notion: {
    baseBlock: process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK || 'cd9c83dd9ea14181854cced99bac68c6',
    customDomain: process.env.NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN || null
  },
  headerNav: [
    {
      name: '카테고리',
      slug: 'dec967958ca74abeb493942f923100f7'
    },
    {
      name: '세팅',
      slug: 'e4b50b569ffb44e9bec7f71bd29fb23b'
    }
  ],
  infomation: {
    nickname: process.env.NEXT_PUBLIC_INFOMATION_NICKNAME || 'sooros',
    email: process.env.NEXT_PUBLIC_INFOMATION_EMAIL,
    github: process.env.NEXT_PUBLIC_INFOMATION_GITHUB,
    repository: process.env.NEXT_PUBLIC_INFOMATION_REPOSITORY
  }
});

export default config;

export const NEXT_IMAGE_DOMAINS = ['www.notion.so', 'notion.so', 's3.us-west-2.amazonaws.com'];
