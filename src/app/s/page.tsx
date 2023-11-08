import { SearchForm } from '@/components/search/SearchForm';
import { REVALIDATE } from '@/lib/notion';
import { siteConfig } from '@/lib/site-config';
import { NotionClient } from '@/server/notion/Notion';
import { NotionStoreProvider } from '@/store/notion';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = REVALIDATE;

export default async function SearchIndex() {
  const data = await getBlogProperties();
  const { blogProperties } = data;
  if (data.notFound) {
    notFound();
  }

  return (
    <NotionStoreProvider store={{ blogProperties }}>
      <div className='w-full max-w-article m-auto my-6 px-3'>
        <div className='max-w-screen-sm mt-4 mx-auto text-center'>
          <h1 className='text-2xl'>검색어를 입력해주세요.</h1>
          <div className='mt-10'>
            <SearchForm autoFocus />
          </div>
        </div>
      </div>
    </NotionStoreProvider>
  );
}

async function getBlogProperties() {
  try {
    const notionClient = new NotionClient();

    const blogProperties = await notionClient.getBlogProperties();

    return {
      blogProperties
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
}

export async function generateMetadata(params: any, _parent: ResolvingMetadata): Promise<Metadata> {
  const parent = await _parent;
  const parentTitle = siteConfig.infomation.blogname || parent.title?.absolute || null;

  return {
    title: `Search${parentTitle ? ` - ${parentTitle}` : ''}`
  };
}
