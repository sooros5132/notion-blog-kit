import type React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import config from 'site-config';
import { NotionService } from 'src-server/service/Notion';
import { NotionRender } from 'src/components/notion';
import { IGetNotion, INotionSearchObject, INotionUserInfo } from 'src/types/notion';

interface HomeProps extends IGetNotion {
  slug: string;
  pageInfo: INotionSearchObject;
  userInfo: INotionUserInfo | null;
}
const Home: NextPage<HomeProps> = ({
  slug,
  blocks,
  childrenBlocks,
  databaseBlocks,
  pageInfo,
  userInfo
}) => {
  return (
    <NotionRender
      slug={slug}
      page={pageInfo}
      blocks={blocks}
      databaseBlocks={databaseBlocks}
      childrenBlocks={childrenBlocks}
      userInfo={userInfo}
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
    const userInfo = await new NotionService().getUserProfile(pageInfo.created_by.id);
    return {
      props: {
        slug: config.notion.baseBlock,
        blocks: blocks.blocks,
        childrenBlocks: blocks.childrenBlocks,
        databaseBlocks: blocks.databaseBlocks,
        pageInfo,
        userInfo
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
