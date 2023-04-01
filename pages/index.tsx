import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import config from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { INotionPage } from 'src/types/notion';
import { useNotionStore } from 'src/store/notion';

interface HomeProps {
  slug: string;
  page: INotionPage;
}
const Home: NextPage<HomeProps> = ({ slug, page }) => {
  useNotionStore.setState({
    slug,
    baseBlock: page.block,
    childrenRecord: page?.block?.childrenRecord || {},
    databaseRecord: page?.block?.databaseRecord || {}
  });

  return <NotionRender slug={slug} page={page} />;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const notionClient = new NotionClient();

    const page = await notionClient
      .getPageByPageId(config.notion.baseBlock)
      .catch(async () => await notionClient.getDatabaseByDatabaseId(config.notion.baseBlock));

    return {
      props: {
        slug: config.notion.baseBlock,
        page
      },
      revalidate: 600
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Home;
