import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
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
    pageInfo: page.pageInfo,
    userInfo: page.userInfo,
    childrenRecord: page?.block?.childrenRecord || {},
    databaseRecord: page?.block?.databaseRecord || {}
  });

  return <NotionRender slug={slug} page={page} />;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const notionClient = new NotionClient();

    const database = (await notionClient.getBlogMainPage({
      databaseId: siteConfig.notion.baseBlock
    })) as INotionPage;

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        page: database
      },
      revalidate: 120
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Home;
