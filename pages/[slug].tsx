import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import { INotionPage, NotionBlogProperties, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
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
            page,
            blogProperties
          },
          revalidate: REVALIDATE
        };
      }
    }

    {
      // title 검색
      const pageInfo = (await notionClient.searchSlug({
        slug,
        property: 'title'
      })) as INotionPage['pageInfo'];

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
            page,
            blogProperties
          },
          revalidate: REVALIDATE
        };
      }
    }

    {
      // uuid로 찾기
      const [pageInfo, databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: slug
        }),
        notionClient.getDatabaseInfo({
          databaseId: slug
        })
      ]);
      const page = pageInfo || databaseInfo;

      if (!page.object || (page.object !== 'page' && page.object !== 'database')) {
        throw 'page is not found';
      }

      const searchedPageSlug =
        page.object === 'database'
          ? richTextToPlainText(
              page?.title || page?.properties?.slug?.rich_text || page.properties.title?.title
            )
          : richTextToPlainText(
              page?.properties?.slug?.rich_text || page.properties.title?.title || page.title
            );

      if (searchedPageSlug) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(page.id.replaceAll('-', ''))}/${encodeURIComponent(
              searchedPageSlug || 'Untitled'
            )}`
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
