import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next';
import { ReactNode } from 'react';
import config from 'site-config';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/notion/NotionRender';
import { IGetNotion, INotionSearchObject } from 'src/types/notion';
import { SWRConfig } from 'swr';

interface HeadingProps {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
  children: ReactNode;
}

const Heading = ({ type, children }: HeadingProps) => {
  return (
    <div
      className={`flex ${
        type === 'heading_1' || type === 'child_database'
          ? 'text-[2em]'
          : type === 'heading_2'
          ? 'text-[1.5em]'
          : type === 'normal'
          ? undefined
          : 'text-[1.2em]'
      } [&>div>.heading-link]:hidden [&:hover>div>.heading-link]:block`}
    >
      <div>
        <div className='heading-link'>dd</div>
      </div>
      {children}
    </div>
  );
};
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
      {/* <Heading type='child_database'>a</Heading>
      <div className='flex-1 flex-center'>
        <button className='btn btn-ghost'>test</button>
      </div> */}

      <NotionRender slug={slug} />
    </SWRConfig>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const [blocks, pageInfo] = await Promise.all([
      axios
        .get<IResponseSuccess<IGetNotion>>(
          config.path + '/notion/blocks/children/list/' + config.notion.baseBlock
        )
        .then((res) => res.data),
      axios
        .get<IResponseSuccess<INotionSearchObject>>(
          config.path + '/notion/pages/' + config.notion.baseBlock
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
