import { NotionClient } from '@/server/notion/Notion';
import { siteConfig } from '@/lib/site-config';
import { NotionDatabasePageView } from '@/components/notion';
import { NotionDatabaseBlocks, NotionDatabasesRetrieve } from '@/types/notion';
import { NotionLayout } from '@/components/notion/lib/NotionLayout';
import { notFound, redirect } from 'next/navigation';
import { NotionArchiveCategories } from '@/components/notion/lib/NotionArchiveCategories';
import { NotionArchiveTags } from '@/components/notion/lib/NotionArchiveTags';
import Link from 'next/link';
import { ARCHIVE_PATH, POST_LIMIT } from '@/lib/constants';
import type { ResolvingMetadata, Metadata } from 'next';
import { NotionStoreProvider } from '@/store/notion';
import { HiOutlineLibrary } from 'react-icons/hi';
import { REVALIDATE } from '@/lib/notion';

export const revalidate = REVALIDATE;

export type ArchiveParams = { params: { params?: ['category' | 'tag', string, string] } };

export default async function Archive({ params: { params } }: ArchiveParams) {
  const [type, name, isNotFound] = params ?? [];
  if (isNotFound || (type && !name) || (type && !['category', 'tag'].includes(type))) {
    redirect(ARCHIVE_PATH);
  }

  const filter =
    type && name
      ? {
          [type]: decodeURIComponent(name)
        }
      : undefined;

  const props = await getArchiveData(filter);
  const { notFound: _notFound, ...store } = props;

  if (_notFound) notFound();

  return (
    <NotionStoreProvider store={store}>
      <NotionLayout>
        <div className='mb-8 text-3xl text-center font-bold'>
          <Link
            className='inline-flex items-center gap-x-2 text-center hover:underline'
            href={ARCHIVE_PATH}
          >
            <HiOutlineLibrary />
            Archive
          </Link>
        </div>
        <NotionArchiveCategories
          selectedCategory={type === 'category' ? name : ''}
          blogProperties={props.blogProperties}
        />
        <NotionArchiveTags
          selectedTag={type === 'tag' ? name : ''}
          blogProperties={props.blogProperties}
        />
        <NotionDatabasePageView
          databaseInfo={props.notionBlock?.pageInfo as NotionDatabasesRetrieve}
          notionBlock={props.notionBlock?.block as NotionDatabaseBlocks}
          filterType={type}
          filterValue={name}
        />
      </NotionLayout>
    </NotionStoreProvider>
  );
}

async function getArchiveData(filter?: { category?: string; tag?: string }) {
  try {
    const notionClient = new NotionClient();

    const database = await notionClient.getDatabaseByDatabaseId({
      databaseId: siteConfig.notion.baseBlock,
      totalPageSize: POST_LIMIT,
      filter
    });
    const blogProperties = await notionClient.getBlogProperties();

    return {
      slug: siteConfig.notion.baseBlock,
      notionBlock: database,
      blogProperties
    };
  } catch (e) {
    return { notFound: true };
  }
}

export async function generateMetadata(
  params: ArchiveParams,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const parent = await _parent;
    const parentTitle = decodeURIComponent(
      siteConfig.infomation.blogname || parent.title?.absolute || ''
    );

    return {
      title: `Archive${parentTitle ? ` - ${parentTitle}` : ''}`
    };
  } catch (e) {
    return {};
  }
}
