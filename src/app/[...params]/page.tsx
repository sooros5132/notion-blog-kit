import type { BlogProperties, GetNotionBlock, NotionDatabasesRetrieve } from '@/types/notion';
import { NotionRender } from '@/components/notion';
import { richTextToPlainText } from '@/components/notion/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { NotionClient } from '@/server/notion/Notion';
import { notFound, redirect } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { getMetadataInPageInfo } from '@/lib/notion';
import { type NotionState, NotionStoreProvider } from '@/store/notion';
import { REVALIDATE } from '@/lib/notion';

export const revalidate = REVALIDATE;
interface SlugProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}

type SlugParams = { params: { params: string[] } };

export default async function Slug({ params: { params } }: SlugParams) {
  const [_uuid, _slug, isNotFound] = params;
  // 3번째 부터는 지원 안함
  if (isNotFound) notFound();

  const {
    notFound: _notFound,
    redirect: _redirect,
    slug,
    blogProperties,
    notionBlock
  } = await getPage(_uuid, decodeURIComponent(_slug));

  if (typeof _redirect === 'string') redirect(_redirect);
  if (_notFound || !slug || !notionBlock) notFound();

  const store: Partial<NotionState> = {
    slug,
    blogProperties,
    baseBlock: notionBlock.block,
    userInfo: notionBlock.userInfo,
    pageInfo: notionBlock.pageInfo,
    childrensRecord: notionBlock.block.childrensRecord,
    databasesRecord: notionBlock.block.databasesRecord
  };

  return (
    <NotionStoreProvider store={store}>
      <NotionRender notionBlock={notionBlock} />
    </NotionStoreProvider>
  );
}

export async function generateStaticParams() {
  return [];
}

async function getPage(_uuid: string, _slug: string) {
  const uuid = _uuid.replaceAll('-', '').trim();
  const slug = _slug.trim();
  try {
    if (typeof uuid !== 'string') {
      throw 'type error "uuid"';
    }
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (uuid === siteConfig.notion.baseBlock) {
      return { redirect: '/' };
    }

    const notionClient = new NotionClient();

    {
      // uuid로 찾기
      const [_pageInfo, _databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: uuid
        }),
        notionClient.getDatabaseInfo({
          databaseId: uuid
        })
      ]);
      const pageInfo = _pageInfo || _databaseInfo || {};

      if (!pageInfo.object || (pageInfo.object !== 'page' && pageInfo.object !== 'database')) {
        throw 'page is not found';
      }

      const searchedPageSlug =
        pageInfo?.object === 'page'
          ? richTextToPlainText(pageInfo?.properties?.slug?.rich_text)
          : '';
      const parentIsBaseDatabase =
        pageInfo?.parent?.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock;
      if (parentIsBaseDatabase) {
        return { redirect: `/${searchedPageSlug}` };
      }

      const notionBlock = await getBlock(pageInfo.id, pageInfo.object);

      if (!notionBlock) {
        throw 'page is not found';
      }

      const blogProperties = await notionClient.getBlogProperties();

      return {
        slug: uuid,
        notionBlock,
        blogProperties
      };
    }
  } catch (e) {
    if (uuid && slug) {
      return { redirect: `/s/${uuid + ' ' + slug}` };
    }
    return { notFound: true };
  }
}

async function getBlock(blockId: string, type: 'database' | 'page'): Promise<GetNotionBlock> {
  const notionClient = new NotionClient();

  switch (type) {
    case 'database': {
      const database = await notionClient.getDatabaseByDatabaseId({ databaseId: blockId });

      return database;
    }
    case 'page': {
      const page = await notionClient.getPageByPageId(blockId);
      return page;
    }
  }
}

export async function generateMetadata(
  { params }: SlugParams,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const parent = await _parent;

  try {
    const [uuid, _slug, isNotFound] = params.params;
    const notionClient = new NotionClient();

    // uuid로 찾기
    const [_pageInfo, _databaseInfo] = (await Promise.all([
      notionClient.getPageInfo({
        pageId: uuid
      }),
      notionClient.getDatabaseInfo({
        databaseId: uuid
      })
    ])) as NotionDatabasesRetrieve[];
    const pageInfo = _pageInfo || _databaseInfo || {};

    const { title, cover, description, icon } = getMetadataInPageInfo(pageInfo);

    return {
      title: title || 'Untitled',
      description: description,
      icons: icon || parent.icons?.icon,
      openGraph: {
        images: cover || parent.openGraph?.images
      }
    };
  } catch (e) {
    return {};
  }
}
