import type { GetNotionBlock } from '@/types/notion';
import { URL_PAGE_TITLE_MAX_LENGTH } from '@/types/notion';
import { NotionClient } from '@/server/notion/Notion';
import { richTextToPlainText } from '@/components/notion/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { NotionRender } from '@/components/notion';
import { type Metadata, type ResolvingMetadata } from 'next';
import { REVALIDATE, getMetadataInPageInfo } from '@/lib/notion';
import { notFound, redirect } from 'next/navigation';
import { type NotionState, NotionStoreProvider } from '@/store/notion';

export const revalidate = REVALIDATE;

type SearchedPostParams = { params: { slug: string } };

export default async function SearchedPost({ params }: SearchedPostParams) {
  const _slug = decodeURIComponent(params.slug || '');

  const {
    notFound: _notFound,
    redirect: _redirect,
    blogArticleRelation,
    blogProperties,
    notionBlock,
    slug
  } = await getPost(_slug);

  if (typeof _redirect === 'string') redirect(_redirect);
  if (_notFound || !slug || !notionBlock) notFound();

  const store: Partial<NotionState> = {
    slug,
    blogProperties,
    baseBlock: notionBlock.block,
    userInfo: notionBlock.userInfo,
    pageInfo: notionBlock.pageInfo,
    childrensRecord: notionBlock.block.childrensRecord,
    databasesRecord: notionBlock.block.databasesRecord,
    blogArticleRelation
  };

  return (
    <NotionStoreProvider store={store}>
      <NotionRender notionBlock={notionBlock} />
    </NotionStoreProvider>
  );
}

export async function generateStaticParams() {
  return await getAllPosts();
}

async function getAllPosts() {
  try {
    const notionClient = new NotionClient();

    const paths: Array<{ slug: string }> = [];

    const database = await notionClient.getAllPublishedPageInDatabase({
      databaseId: siteConfig.notion.baseBlock
    });

    database.results.forEach((page) => {
      const slug = page.properties.slug?.rich_text
        ?.map((text) => text.plain_text.trim())
        .join('')
        .slice(0, URL_PAGE_TITLE_MAX_LENGTH);

      if (slug) {
        paths.push({ slug });
      }
    });
    return paths;
  } catch (e) {
    return [];
  }
}

async function getPost(slug: string) {
  try {
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (slug === siteConfig.notion.baseBlock) {
      return { redirect: '/' };
    }

    const notionClient = new NotionClient();

    {
      // slug 검색
      const pageInfo = await notionClient.searchSlug({
        slug,
        property: 'slug'
      });

      if (pageInfo) {
        const page = await getBlock(pageInfo.id, pageInfo.object);

        if (
          page?.pageInfo?.properties?.publishedAt?.type === 'date' &&
          !page?.pageInfo?.properties?.publishedAt?.date?.start
        ) {
          return { notFound: true };
        }

        const blogProperties = await notionClient.getBlogProperties();
        let blogArticleRelation = undefined;

        if (page?.pageInfo?.object === 'page') {
          blogArticleRelation = await notionClient.getBlogArticleRelation({
            pageId: pageInfo.id.replaceAll('-', '')
          });
        }

        return {
          slug,
          notionBlock: page,
          blogProperties,
          blogArticleRelation
        };
      }
    }

    {
      // title 검색
      const pageInfo = await notionClient.searchSlug({
        slug,
        property: 'title'
      });

      if (pageInfo) {
        if (pageInfo.parent.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock) {
          const newSlug = richTextToPlainText(pageInfo.properties.slug?.rich_text);
          if (newSlug) {
            return { redirect: `/${newSlug}` };
          }
        }
        const page = await getBlock(pageInfo.id, pageInfo.object);
        const blogProperties = await notionClient.getBlogProperties();
        let blogArticleRelation = undefined;

        if (page?.pageInfo?.object === 'page') {
          blogArticleRelation = await notionClient.getBlogArticleRelation({
            pageId: pageInfo.id.replaceAll('-', '')
          });
        }

        return {
          slug,
          notionBlock: page,
          blogProperties,
          blogArticleRelation
        };
      }
    }

    {
      // uuid로 찾기
      const [_pageInfo, _databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: slug
        }),
        notionClient.getDatabaseInfo({
          databaseId: slug
        })
      ]);
      const pageInfo = (_pageInfo || _databaseInfo) as GetNotionBlock['pageInfo'];

      if (!pageInfo.object || (pageInfo.object !== 'page' && pageInfo.object !== 'database')) {
        throw 'page is not found';
      }

      let searchedPageSlug = '';

      switch (pageInfo.object) {
        case 'database': {
          searchedPageSlug = richTextToPlainText(
            pageInfo?.title ||
              pageInfo?.properties?.slug?.rich_text ||
              pageInfo.properties.title?.title
          );
          break;
        }
        case 'page': {
          richTextToPlainText(
            pageInfo?.properties?.slug?.rich_text || pageInfo.properties.title?.title
          );
          break;
        }
      }

      if (searchedPageSlug) {
        return {
          redirect: `/${pageInfo.id.replaceAll('-', '')}/${searchedPageSlug || 'Untitled'}`
        };
      }
    }

    throw 'page is not found';
  } catch (e) {
    if (typeof slug === 'string') {
      return { redirect: '/s/' + slug };
    }
    return { notFound: true };
  }
}

async function getBlock(blockId: string, type: 'database' | 'page') {
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
  { params }: SearchedPostParams,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const parent = await _parent;

  try {
    const slug = decodeURIComponent(params.slug);
    const notionClient = new NotionClient();
    const pageInfo =
      (await notionClient.searchSlug({
        slug,
        property: 'slug'
      })) ||
      (await notionClient.searchSlug({
        slug,
        property: 'title'
      }));

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
