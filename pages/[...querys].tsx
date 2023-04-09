import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { BlogProperties, GetNotionBlock } from 'src/types/notion';
import { NotionRender } from 'src/components/notion';
import { NotionClient } from 'lib/notion/Notion';
import { useNotionStore } from 'src/store/notion';
import { siteConfig } from 'site-config';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
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
      pageInfo: notionBlock.pageInfo,
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
        pageInfo: notionBlock.pageInfo,
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

const getBlock = async (blockId: string, type: 'database' | 'page'): Promise<GetNotionBlock> => {
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
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  const uuid = params?.querys?.[0]?.replaceAll('-', '');
  const slug = params?.querys?.[1];
  try {
    if (typeof uuid !== 'string') {
      throw 'type error "uuid"';
    }
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (uuid === siteConfig.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
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

      if (pageInfo?.parent?.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(searchedPageSlug)}`
          }
        };
      }

      const notionBlock = await getBlock(pageInfo.id, pageInfo.object);

      if (!notionBlock) {
        throw 'page is not found';
      }

      const blogProperties = await notionClient.getBlogProperties();

      return {
        props: {
          notionBlock,
          blogProperties,
          slug: uuid
        }
      };
    }
  } catch (e) {
    if (uuid && slug) {
      return {
        redirect: {
          permanent: false,
          destination: `/s/${encodeURIComponent(uuid + ' ' + slug)}`
        }
      };
    }
    return {
      notFound: true
    };
  }
};
