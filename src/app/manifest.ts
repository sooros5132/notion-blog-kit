import { siteConfig } from '@/lib/site-config';
import { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const blogname = siteConfig.infomation.blogname || 'notion-blog-kit';

  return {
    name: blogname,
    short_name: blogname,
    description: blogname,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#313335',
    theme_color: '#313335',
    icons: [
      {
        src: '/icon-48x48.png',
        sizes: '48x48',
        type: 'image/png'
      },
      {
        src: '/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png'
      },
      {
        src: '/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png'
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icon-284x284.png',
        sizes: '284x284',
        type: 'image/png'
      },
      {
        src: 'icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
