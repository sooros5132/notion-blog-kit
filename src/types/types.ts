export type LinkPreview = {
  icon: string | null;
  title: string | null;
  description: string | null;
  type: string | null;
  image: {
    url: string | null;
    alt: string | null;
  };
  media: string | null;
  username: string | null;
};

export interface SiteConfig extends Record<string, any> {
  origin: string;
  path: string;
  notion: {
    baseBlock: string;
    secretKey: string;
    customDomain: string | null;
    notionSoRegExp?: RegExp;
    notionSiteRegExp?: RegExp;
  };
  TZ: string;
}
