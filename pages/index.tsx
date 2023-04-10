import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { REVALIDATE } from 'src/lib/notion';
import { BlogProperties, GetNotionBlock } from 'src/types/notion';

interface HomeProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}

const Home: NextPage<HomeProps> = () => {
  return <NotionRender />;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const notionClient = new NotionClient();

    const database = await notionClient.getMainDatabase();
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

export default Home;
