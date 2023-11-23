import { NotionClient } from '@/server/notion/Notion';
import Archive, { ArchiveParams } from '../page';
import type { Metadata, ResolvingMetadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { REVALIDATE } from '@/lib/notion';

export const revalidate = REVALIDATE;

export default Archive;

export async function generateStaticParams() {
  try {
    const notionClient = new NotionClient();
    const blogProperties = await notionClient.getBlogProperties();

    const paths: Array<{ params: string[] }> = blogProperties.categories.map((category) => ({
      params: ['category', category.name]
    }));

    return paths;
  } catch (e) {
    return [];
  }
}

export async function generateMetadata(
  { params }: ArchiveParams,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const [, _name] = params.params || [];
    const name = decodeURIComponent(_name || '');
    const parent = await _parent;
    const parentTitle = decodeURIComponent(
      siteConfig.infomation.blogname || parent.title?.absolute || ''
    );

    return {
      title: `${name}${parentTitle ? ` - ${parentTitle}` : ''}`
    };
  } catch (e) {
    return {};
  }
}
