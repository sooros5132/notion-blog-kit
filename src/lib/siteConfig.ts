import { SiteConfig } from 'src/types/types';

export function siteConfig(config: SiteConfig) {
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

  return config;
}
