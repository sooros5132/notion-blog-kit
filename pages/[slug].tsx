import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import type {
  BlogProperties,
  GetNotionBlock,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve
} from 'src/types/notion';
import { URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
import { NotionClient } from 'lib/notion/Notion';
import { useNotionStore } from 'src/store/notion';
import { siteConfig } from 'site-config';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { REVALIDATE } from 'src/lib/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface SlugProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}

export default function Slug({ slug, notionBlock, blogProperties }: SlugProps) {
  const router = useRouter();
  const hydrated = useSiteSettingStore().hydrated;
  if (!hydrated) {
    useNotionStore.getState().init({
      slug,
      blogProperties,
      baseBlock: notionBlock.block,
      pageInfo: notionBlock?.pageInfo,
      userInfo: notionBlock.userInfo,
      childrensRecord: notionBlock?.block?.childrensRecord || {},
      databasesRecord: notionBlock?.block?.databasesRecord || {}
    });
  }

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      useNotionStore.getState().init({
        slug,
        blogProperties,
        baseBlock: notionBlock.block,
        pageInfo: notionBlock?.pageInfo,
        userInfo: notionBlock.userInfo,
        childrensRecord: notionBlock?.block?.childrensRecord || {},
        databasesRecord: notionBlock?.block?.databasesRecord || {}
      });
    };
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [blogProperties, notionBlock, router.events, slug]);

  return <NotionRender key={router?.asPath || 'key'} slug={slug} notionBlock={notionBlock} />;
}

const getBlock = async (blockId: string, type: 'database' | 'page') => {
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
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const notionClient = new NotionClient();

  const paths: Awaited<ReturnType<GetStaticPaths<{ slug: string }>>>['paths'] = [];

  const database = await notionClient.getAllPublishedPageInDatabase({
    databaseId: siteConfig.notion.baseBlock
  });
  database.results.forEach((page) => {
    const slug = page.properties.slug?.rich_text
      ?.map((text) => text.plain_text.trim())
      .join('')
      .slice(0, URL_PAGE_TITLE_MAX_LENGTH);

    if (slug) {
      paths.push({ params: { slug: slug } });
    }
  });

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  const slug = params?.slug;
  try {
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (slug === siteConfig.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
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
        const blogProperties = await notionClient.getBlogProperties();

        return {
          props: {
            slug,
            notionBlock: page,
            blogProperties
          },
          revalidate: REVALIDATE
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
            return {
              redirect: {
                permanent: false,
                destination: `/${encodeURIComponent(newSlug)}`
              }
            };
          }
        }
        const page = await getBlock(pageInfo.id, pageInfo.object);
        const blogProperties = await notionClient.getBlogProperties();

        return {
          props: {
            slug,
            notionBlock: page,
            blogProperties
          },
          revalidate: REVALIDATE
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
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(
              pageInfo.id.replaceAll('-', '')
            )}/${encodeURIComponent(searchedPageSlug || 'Untitled')}`
          }
        };
      }
    }

    throw 'page is not found';
  } catch (e) {
    if (typeof slug === 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/s/' + encodeURIComponent(slug)
        }
      };
    }
    return {
      notFound: true
    };
  }
};
