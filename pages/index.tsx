import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next';
import { ReactNode } from 'react';
import config from 'site-config';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/notion/NotionRender';
import { IGetNotion, INotionSearchObject } from 'src/types/notion';
import { SWRConfig } from 'swr';

interface HomeProps {
  slug: string;
  notionBlocksChildrenList: IGetNotion;
  pageInfo: INotionSearchObject;
}
const Home: NextPage<HomeProps> = ({ slug, notionBlocksChildrenList, pageInfo }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          ['/notion/blocks/children/list/' + slug]: notionBlocksChildrenList,
          ['/notion/pages/' + slug]: pageInfo
        }
      }}
    >
      <NotionRender slug={slug} />
    </SWRConfig>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const [blocks, pageInfo] = await Promise.all([
      axios
        .get<IResponseSuccess<IGetNotion>>(
          config.origin + config.path + '/notion/blocks/children/list/' + config.notion.baseBlock
        )
        .then((res) => res.data),
      axios
        .get<IResponseSuccess<INotionSearchObject>>(
          config.origin + config.path + '/notion/pages/' + config.notion.baseBlock
        )
        .then((res) => res.data)
    ]);

    if (!blocks?.success || !pageInfo?.success) {
      throw '';
    }
    return {
      props: {
        slug: config.notion.baseBlock,
        notionBlocksChildrenList: blocks.result,
        pageInfo: pageInfo.result
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
