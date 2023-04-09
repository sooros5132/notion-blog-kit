import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { BlogProperties, GetNotionBlock } from 'src/types/notion';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { useNotionStore } from 'src/store/notion';
import { REVALIDATE } from 'src/lib/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface CategoryProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Category: NextPage<CategoryProps> = ({ slug, notionBlock, blogProperties }) => {
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
};

export const getStaticPaths: GetStaticPaths<{ category: string }> = async () => {
  const notionClient = new NotionClient();

  const paths: Awaited<ReturnType<GetStaticPaths<{ category: string }>>>['paths'] = [];

  const database = await notionClient.getDatabaseInfo({
    databaseId: siteConfig.notion.baseBlock
  });

  const categories = database?.properties?.category?.select?.options || [];
  for (const category of categories) {
    paths.push({
      params: {
        category: category.name
      }
    });
  }

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async ({ params }) => {
  const category = params?.category;
  try {
    if (typeof category !== 'string') {
      throw 'page is not found';
    }
    const notionClient = new NotionClient();

    const database = await notionClient.getDatabaseByDatabaseId({
      databaseId: siteConfig.notion.baseBlock
      // filter: {
      //   category
      // }
    });

    const blogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        notionBlock: database,
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

export default Category;
