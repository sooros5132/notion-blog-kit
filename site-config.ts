import { createSiteConfig } from 'src/lib/siteConfig';

export const siteConfig = createSiteConfig({
  TZ: 'Asia/Seoul',
  path: '/api/v1',
  notion: {
    baseBlock: (
      process.env.NEXT_PUBLIC_NOTION_DATABASE_ID ||
      process.env.NEXT_PUBLIC_NOTION_BASE_BLOCK ||
      ''
    )
      .replaceAll('-', '')
      .slice(0, 32),
    customDomain: process.env.NEXT_PUBLIC_NOTION_CUSTOM_DOMAIN || null
  },
  infomation: {
    blogname: process.env.NEXT_PUBLIC_INFOMATION_BLOGNAME || '',
    email: process.env.NEXT_PUBLIC_INFOMATION_EMAIL,
    github: process.env.NEXT_PUBLIC_INFOMATION_GITHUB,
    repository: process.env.NEXT_PUBLIC_INFOMATION_REPOSITORY
  },
  enableImageOptimization:
    process.env.NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION === 'true' ? true : false || false,
  hidePoweredBy: process.env.NEXT_PUBLIC_HIDE_POWERED_BY === 'true',
  googleGTag: process.env.NEXT_PUBLIC_GOOGLE_G_TAG
});
