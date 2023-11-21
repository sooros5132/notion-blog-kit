import { siteConfig } from '@/lib/site-config';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  let origin;
  try {
    const url = new URL(siteConfig.infomation.origin);
    origin = url.origin;
  } catch (e) {
    origin = '';
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/s/'
    },
    sitemap: `${origin}/sitemap.xml`
  };
}
