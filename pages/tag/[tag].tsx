import type React from 'react';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import type { BlogProperties, GetNotionBlock } from 'src/types/notion';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { REVALIDATE } from 'src/lib/notion';

interface TagProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Tag: NextPage<TagProps> = () => {
  return <NotionRender />;
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

export default Tag;
