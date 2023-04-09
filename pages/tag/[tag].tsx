import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { INotionPage, NotionBlogProperties } from 'src/types/notion';
import { useNotionStore } from 'src/store/notion';
import { REVALIDATE } from 'src/lib/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface TagProps {
  slug: string;
  page: INotionPage;
  blogProperties: NotionBlogProperties;
}
const Tag: NextPage<TagProps> = ({ slug, page, blogProperties }) => {
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
};

export const getStaticPaths: GetStaticPaths<{ tag: string }> = async () => {
  const notionClient = new NotionClient();

  const paths: Awaited<ReturnType<GetStaticPaths<{ tag: string }>>>['paths'] = [];

  const database = await notionClient.getDatabaseInfo({
    databaseId: siteConfig.notion.baseBlock
  });

  const tags = database?.properties?.tags?.multi_select?.options || [];
  for (const tag of tags) {
    paths.push({
      params: {
        tag: tag.name
      }
    });
  }

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<TagProps> = async ({ params }) => {
  const tag = params?.tag;
  try {
    if (typeof tag !== 'string') {
      throw 'page is not found';
    }
    const notionClient = new NotionClient();

    const database = await notionClient.getDatabaseByDatabaseId({
      databaseId: siteConfig.notion.baseBlock
      // filter: {
      //   tag
      // }
    });
    const blogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        page: database as INotionPage,
        blogProperties
      },
      revalidate: REVALIDATE
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Tag;
