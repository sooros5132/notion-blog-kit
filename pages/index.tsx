import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { INotionPage, NotionBlogProperties } from 'src/types/notion';
import { useNotionStore } from 'src/store/notion';
import { REVALIDATE } from 'src/lib/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';

interface HomeProps {
  slug: string;
  database: INotionPage;
  blogProperties: NotionBlogProperties;
}
const Home: NextPage<HomeProps> = ({ slug, database, blogProperties }) => {
  const hydrated = useSiteSettingStore().hydrated;
  if (!hydrated) {
    useNotionStore.getState().init({
      slug,
      blogProperties: blogProperties,
      baseBlock: database.block,
      pageInfo: database.pageInfo,
      userInfo: database.userInfo,
      childrenRecord: database?.block?.childrenRecord || {},
      databaseRecord: database?.block?.databaseRecord || {}
    });
  }

  return <NotionRender slug={slug} page={database} />;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const notionClient = new NotionClient();

    const database = await notionClient.getMainDatabase();
    const blogProperties = await notionClient.getBlogProperties();

    return {
      props: {
        slug: siteConfig.notion.baseBlock,
        database,
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
