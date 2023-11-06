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
  language: string;
  TZ: string;
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
  infomation: {
    blogname: string;
    origin: string;
    email?: string;
    github?: string;
    repository?: string;
  };
  enableImageOptimization: boolean;
  showSourceCodeLink: boolean;
  googleAnalyticsId?: string;
  utterances: {
    repo: string;
    label: string;
  };
  giscus: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
}

export interface NextAppContext {
  params: Record<string, Array<string> | string>;
  searchParams: Record<string, Array<string> | string>;
}
