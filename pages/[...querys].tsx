import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import { INotionPage, NotionBlogProperties } from 'src/types/notion';
import { NotionClient } from 'lib/notion/Notion';
import { useNotionStore } from 'src/store/notion';
import { siteConfig } from 'site-config';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface SlugProps {
  slug: string;
  page: INotionPage;
  blogProperties: NotionBlogProperties;
}

export default function Slug({ slug, page, blogProperties }: SlugProps) {
  const router = useRouter();
  const hydrated = useSiteSettingStore().hydrated;
  if (!hydrated) {
    useNotionStore.getState().init({
      slug,
      blogProperties,
      baseBlock: page.block,
      pageInfo: page.pageInfo,
      userInfo: page.userInfo,
      childrenRecord: page?.block?.childrenRecord || {},
      databaseRecord: page?.block?.databaseRecord || {}
    });
  }

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      useNotionStore.getState().init({
        slug,
        blogProperties,
        baseBlock: page.block,
        pageInfo: page.pageInfo,
        userInfo: page.userInfo,
        childrenRecord: page?.block?.childrenRecord || {},
        databaseRecord: page?.block?.databaseRecord || {}
      });
    };
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [blogProperties, page.block, page.pageInfo, page.userInfo, router.events, slug]);

  return <NotionRender key={router?.asPath || 'key'} slug={slug} page={page} />;
}

const getBlock = async (blockId: string, type: 'database' | 'page'): Promise<INotionPage> => {
  const notionClient = new NotionClient();

  switch (type) {
    case 'database': {
      const database = await notionClient.getDatabaseByDatabaseId({ databaseId: blockId });

      return database as INotionPage;
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
      const [pageInfo, databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: uuid
        }),
        notionClient.getDatabaseInfo({
          databaseId: uuid
        })
      ]);
      const page = pageInfo || databaseInfo || {};

      if (!page.object || (page.object !== 'page' && page.object !== 'database')) {
        throw 'page is not found';
      }

      const searchedPageSlug =
        page?.object === 'page' ? richTextToPlainText(page?.properties?.slug?.rich_text) : '';

      if (page?.parent?.database_id?.replaceAll('-', '') === siteConfig.notion.baseBlock) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(searchedPageSlug)}`
          }
        };
      }

      const block = await getBlock(page.id, page.object);

      if (!block) {
        throw 'page is not found';
      }

      const blogProperties = await notionClient.getBlogProperties();

      return {
        props: {
          page: block,
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
