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
  path: string;
  notion: {
    baseBlock: string;
    customDomain: string | null;
    notionSoRegExp?: RegExp;
    notionSiteRegExp?: RegExp;
  };
  headerNav?: Array<{
    name: string;
    slug: string;
  }>;
  TZ: string;
  infomation: {
    blogname: string;
    email?: string;
    github?: string;
    repository?: string;
  };
  enableImageOptimization: boolean;
  hidePoweredBy: boolean;
  googleGTag?: string;
}

export interface NextAppContext {
  params: Record<string, Array<string> | string>;
  searchParams: Record<string, Array<string> | string>;
}
