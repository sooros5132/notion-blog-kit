import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/modules/NotionRender';
import { NotionBlock, NotionBlocksChildrenList, NotionPagesRetrieve } from 'src/types/notion';
import useSWR, { SWRConfig } from 'swr';
import { BASE_API_PATH, NOTION_BASE_BLOCK } from '../src/lib/constants';

interface HomeProps {
  slug: string;
  notionBlocksChildrenList: NotionBlocksChildrenList;
  pageInfo: NotionPagesRetrieve;
}
const Home: NextPage<HomeProps> = ({ slug, notionBlocksChildrenList, pageInfo }) => {
  const [query, setQuery] = useState<{
    start_cursor?: string;
    page_size?: number;
  }>();

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
        .get<IResponseSuccess<NotionBlocksChildrenList>>(
          BASE_API_PATH + '/notion/blocks/children/list/' + NOTION_BASE_BLOCK
        )
        .then((res) => res.data),
      axios
        .get<IResponseSuccess<NotionPagesRetrieve>>(
          BASE_API_PATH + '/notion/pages/' + NOTION_BASE_BLOCK
        )
        .then((res) => res.data)
    ]);

    if (!blocks?.success || !pageInfo?.success) {
      throw '';
    }
    return {
      props: {
        slug: NOTION_BASE_BLOCK,
        notionBlocksChildrenList: blocks.result,
        pageInfo: pageInfo.result
      },
      revalidate: 60
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Home;
