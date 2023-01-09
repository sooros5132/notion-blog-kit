import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import config from 'site-config';
import { NotionService } from 'src-server/service/Notion';
import { NotionRender } from 'src/components/notion';
import { IGetNotion, INotionSearchObject } from 'src/types/notion';

interface HomeProps extends IGetNotion {
  slug: string;
  pageInfo: INotionSearchObject;
}
const Home: NextPage<HomeProps> = ({ slug, blocks, childrenBlocks, databaseBlocks, pageInfo }) => {
  return (
    <NotionRender
      slug={slug}
      page={pageInfo}
      blocks={blocks}
      databaseBlocks={databaseBlocks}
      childrenBlocks={childrenBlocks}
    />
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const notionService = new NotionService();
    const [blocks, pageInfo] = await Promise.all([
      notionService.getAllBlocksAndChildrens(config.notion.baseBlock),
      notionService.getPageInfoByPageId(config.notion.baseBlock)
    ]);
    return {
      props: {
        slug: config.notion.baseBlock,
        blocks: blocks.blocks,
        childrenBlocks: blocks.childrenBlocks,
        databaseBlocks: blocks.databaseBlocks,
        pageInfo: pageInfo
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
