import { SiteConfig } from '@/types/types';

const isBrowser = typeof window !== 'undefined';

export const init = {
  TZ: 'Etc/UTC',
  language: 'en-US'
} as const;

export const siteConfig = createSiteConfig({
  language: isBrowser ? navigator?.language || init.language : init.language,
  TZ: isBrowser ? Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || init.TZ : init.TZ,
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
    origin: process.env.NEXT_PUBLIC_INFOMATION_ORIGIN || '',
    email: process.env.NEXT_PUBLIC_INFOMATION_EMAIL,
    github: process.env.NEXT_PUBLIC_INFOMATION_GITHUB,
    repository: process.env.NEXT_PUBLIC_INFOMATION_REPOSITORY
  },
  enableImageOptimization:
    process.env.NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION === 'true' ? true : false || false,
  showSourceCodeLink: process.env.NEXT_PUBLIC_SHOW_SOURCE_CODE_LINK === 'true',
  googleAnalyticsId:
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || process.env.NEXT_PUBLIC_GOOGLE_G_TAG,
  utterances: {
    repo: process.env.NEXT_PUBLIC_UTTERANCES_REPOSITORY || '',
    label: process.env.NEXT_PUBLIC_UTTERANCES_LABEL || ''
  },
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY || '',
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID || '',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || '',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ''
  }
});

function createSiteConfig(config: SiteConfig) {
  const NEXT_PUBLIC_HEADER_MENU = process.env.NEXT_PUBLIC_HEADER_MENU;
  const headerNav: SiteConfig['headerNav'] = [];

  if (NEXT_PUBLIC_HEADER_MENU) {
    const stringList = NEXT_PUBLIC_HEADER_MENU.split(',');
    const stringListLen = stringList.length;
    if (stringListLen > 1 && stringListLen % 2 === 0) {
      for (let i = 0; i <= stringListLen / 2; i = i + 2) {
        headerNav.push({
          name: stringList[i],
          slug: stringList[i + 1].trim()
        });
      }
    }
  }

  if (config.notion.customDomain) {
    config.notion.notionSoRegExp = new RegExp(
      `^https?://${config.notion.customDomain}.notion.site/`,
      'i'
    );
    config.notion.notionSiteRegExp = new RegExp(
      `^https?://(www.)?notion.so/${config.notion.customDomain}/`,
      'i'
    );
  }

  return { ...config, headerNav };
}
