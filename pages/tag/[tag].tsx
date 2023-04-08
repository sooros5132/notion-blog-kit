import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { INotionPage } from 'src/types/notion';
import { useNotionStore } from 'src/store/notion';

interface TagProps {
  slug: string;
  page: INotionPage;
}
const Tag: NextPage<TagProps> = ({ slug, page }) => {
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

    const database = await notionClient.getBlogMainPage({
      databaseId: siteConfig.notion.baseBlock
      // filter: {
      //   tag
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

export default Tag;
