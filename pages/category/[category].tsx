import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { INotionPage } from 'src/types/notion';
import { useNotionStore } from 'src/store/notion';

interface CategoryProps {
  slug: string;
  page: INotionPage;
}
const Category: NextPage<CategoryProps> = ({ slug, page }) => {
  useNotionStore.setState({
    slug,
    baseBlock: page.block,
    pageInfo: page.pageInfo,
    userInfo: page.userInfo,
    childrenRecord: page?.block?.childrenRecord || {},
    databaseRecord: page?.block?.databaseRecord || {}
  });

  return <NotionRender slug={slug} page={page} />;
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

    const database = await notionClient.getBlogMainPage({
      databaseId: siteConfig.notion.baseBlock
      // filter: {
      //   category
      // }
    });

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        page: database as INotionPage
      },
      revalidate: 120
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Category;
