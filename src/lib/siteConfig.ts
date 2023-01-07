import { SiteConfig } from 'src/types/types';

export function siteConfig(config: SiteConfig) {
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
      `^https?:\/\/${config.notion.customDomain}.notion.site/`,
      'i'
    );
    config.notion.notionSiteRegExp = new RegExp(
      `^https?:\/\/(www\.)?notion.so\/${config.notion.customDomain}\/`,
      'i'
    );
  }

  return { ...config, headerNav };
}
