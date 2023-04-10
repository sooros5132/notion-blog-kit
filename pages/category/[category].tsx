import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { BlogProperties, GetNotionBlock } from 'src/types/notion';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { REVALIDATE } from 'src/lib/notion';

interface CategoryProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Category: NextPage<CategoryProps> = () => {
  return <NotionRender />;
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
