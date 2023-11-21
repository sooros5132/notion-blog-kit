import { richTextToPlainText } from '@/components/notion/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { NotionClient } from '@/server/notion/Notion';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = new URL(siteConfig.infomation.origin);
  const origin = url.origin;

  const notion = new NotionClient();
  const posts = await notion
    .getAllPublishedPageInDatabase({
      databaseId: siteConfig.notion.baseBlock
    })
    .then<MetadataRoute.Sitemap>((res) => {
      const posts = res?.results;
      if (!posts?.length) return [];

      const sitemap = posts.map((post) => {
        const parentDatabaseId = post?.parent?.database_id?.replaceAll('-', '');
        const slug = richTextToPlainText(
          post?.properties?.slug?.rich_text || post?.properties?.title?.title
        );
        const title = richTextToPlainText(
          post?.properties?.title?.title || post?.properties?.slug?.rich_text
        );
        const url =
          parentDatabaseId === siteConfig.notion.baseBlock
            ? `${origin}/${slug}`
            : `${origin}/${post.id.replaceAll('-', '')}/${slug || title || 'Untitled'}`;

        const sitemap: MetadataRoute.Sitemap[number] = {
          url,
          lastModified: new Date(post.last_edited_time),
          changeFrequency: 'daily',
          priority: 1
        };
        return sitemap;
      });

      return sitemap;
    })
    .catch(() => [] as MetadataRoute.Sitemap);

  return [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1
    },
    {
      url: `${origin}/archive`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1
    },
    ...posts
  ];
}
