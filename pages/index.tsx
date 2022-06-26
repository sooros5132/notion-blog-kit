import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';
import type { GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/modules/NotionRender';
import { NotionBlocksChildrenList } from 'src/types/notion';
import useSWR, { SWRConfig } from 'swr';
import { BASE_API_PATH, NOTION_BASE_BLOCK } from '../src/lib/constants';

interface HomeProps {
  fallback: {
    '/notion/blocks/children/list': NotionBlocksChildrenList;
    '/notion/pages': GetPageResponse;
  };
}
const Home: NextPage<HomeProps> = ({ fallback }) => {
  const [query, setQuery] = useState<{
    start_cursor?: string;
    page_size?: number;
  }>();

  return (
    <SWRConfig
      value={{
        fallback
      }}
    >
      <NotionRender key={`notion-render`} />
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
        .get<IResponseSuccess<GetPageResponse>>(
          BASE_API_PATH + '/notion/pages/' + NOTION_BASE_BLOCK
        )
        .then((res) => res.data)
    ]);

    if (!blocks?.success || !pageInfo?.success) {
      throw '';
    }
    return {
      props: {
        fallback: {
          '/notion/blocks/children/list': blocks.result,
          '/notion/pages': pageInfo.result
        }
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
