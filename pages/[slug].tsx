import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import config from 'site-setting';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/modules/NotionRender';
import { IGetNotion, NotionDatabasesQuery } from 'src/types/notion';
import { SWRConfig } from 'swr';

interface SlugProps {
  slug: string;
  fallback: {
    '/notion/blocks/children/list': IGetNotion;
    '/notion/pages': GetPageResponse;
  };
}

const Slug: NextPage<SlugProps> = ({ slug, fallback }) => {
  const [query, setQuery] = useState<{
    start_cursor?: string;
    page_size?: number;
  }>();

  return (
    <SWRConfig
      value={{
        fallback: {
          ['/notion/blocks/children/list/' + slug]: fallback['/notion/blocks/children/list'],
          ['/notion/pages/' + slug]: fallback['/notion/pages']
        }
      }}
    >
      <NotionRender slug={slug} />
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const databases = await fetch(
      config.origin + config.path + '/notion/databases/' + config.notion.baseDatabase
    ).then(async (res) => (await res.json()) as IResponseSuccess<NotionDatabasesQuery>);

    // axios
    // .get<IResponseSuccess<NotionDatabasesQuery>>(config.path + '/notion/databases/' + config.notion.baseDatabase)
    // .then((res) => res.data?.result?.results);

    if (!Array.isArray(databases)) {
      throw 'type error databases';
    }

    const paths = databases.map((page) => ({
      params: { slug: page?.id }
    }));

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  try {
    const slug = params?.slug;
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }

    const [blocks, pageInfo] = await Promise.all([
      axios
        .get<IResponseSuccess<IGetNotion>>(
          config.origin + config.path + '/notion/blocks/children/list/' + slug,
          {
            params
          }
        )
        .then((res) => res.data),
      axios
        .get<IResponseSuccess<GetPageResponse>>(
          config.origin + config.path + '/notion/pages/' + slug,
          {
            params
          }
        )
        .then((res) => res.data)
    ]);

    if (!blocks?.success || !pageInfo?.success) {
      throw '';
    }
    return {
      props: {
        slug,
        fallback: {
          '/notion/blocks/children/list': blocks.result,
          '/notion/pages': pageInfo.result
        }
      },
      revalidate: 600
    };
  } catch (e) {
    return {
      notFound: true
    };
  }
};

export default Slug;
