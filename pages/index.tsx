import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import { siteConfig } from 'site-config';
import { NotionClient } from 'lib/notion/Notion';
import { NotionRender } from 'src/components/notion';
import { useNotionStore } from 'src/store/notion';
import { REVALIDATE } from 'src/lib/notion';
import { useSiteSettingStore } from 'src/store/siteSetting';
import { BlogProperties, GetNotionBlock } from 'src/types/notion';

interface HomeProps {
  slug: string;
  notionBlock: GetNotionBlock;
  blogProperties: BlogProperties;
}
const Home: NextPage<HomeProps> = ({ slug, notionBlock, blogProperties }) => {
  const hydrated = useSiteSettingStore().hydrated;
  if (!hydrated) {
    useNotionStore.getState().init({
      slug,
      blogProperties: blogProperties,
      baseBlock: notionBlock.block,
      pageInfo: notionBlock.pageInfo,
      userInfo: notionBlock.userInfo,
      childrensRecord: notionBlock?.block?.childrensRecord || {},
      databasesRecord: notionBlock?.block?.databasesRecord || {}
    });
  }

  return <NotionRender slug={slug} notionBlock={notionBlock} />;
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
