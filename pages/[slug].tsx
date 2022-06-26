import { CircularProgress } from '@mui/material';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/modules/NotionRender';
import { fetcher } from 'src/lib/swr';
import { NotionBlocksChildrenList } from 'src/types/notion';
import useSWR, { SWRConfig } from 'swr';
import { BASE_API_PATH, NOTION_BASE_BLOCK } from '../src/lib/constants';

interface SlugProps {
  params: ParsedUrlQuery;
  fallback: {
    '/notion/blocks/children/list': NotionBlocksChildrenList;
    '/notion/pages': GetPageResponse;
  };
}

const Slug: React.FC = () => {
  const { data: blocks } = useSWR<NotionBlocksChildrenList>('/notion/blocks/children/list');
  const { data: pages } = useSWR<NotionBlocksChildrenList>('/notion/pages');

  return <div>{JSON.stringify(blocks)}</div>;
};

const Page: NextPage<SlugProps> = ({ fallback }) => {
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
      <Slug />
    </SWRConfig>
  );
  // if (isValidating) {
  //   return <CircularProgress size={20} />;
  // }
  // if (error || !blocks || !blocks?.results) {
  //   return <div>표시할 내용이 없습니다.</div>;
  // }
  // return <NotionRender blocks={blocks.results} key={`notion-render`} />;
};

export const getServerSideProps: GetServerSideProps<SlugProps> = async ({ query }) => {
  try {
    const { slug } = query;

    const [blocks, pageInfo] = await Promise.all([
      axios
        .get<IResponseSuccess<NotionBlocksChildrenList>>(
          BASE_API_PATH + '/notion/blocks/children/list/' + slug,
          {
            params: query
          }
        )
        .then((res) => res.data),
      axios
        .get<IResponseSuccess<GetPageResponse>>(BASE_API_PATH + '/notion/pages/' + slug, {
          params: query
        })
        .then((res) => res.data)
    ]);

    if (!blocks?.success || !pageInfo?.success) {
      throw '';
    }
    return {
      props: {
        params: query,
        fallback: {
          '/notion/blocks/children/list': blocks.result,
          '/notion/pages': pageInfo.result
        }
      }
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Page;
