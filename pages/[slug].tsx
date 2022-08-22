import axios from 'axios';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useState } from 'react';
import config from 'site-config';
import { IResponseSuccess } from 'src-server/types/response';
import NotionRender from 'src/components/notion/NotionRender';
import {
  IGetNotion,
  INotionSearch,
  INotionSearchObject,
  NotionDatabasesQuery
} from 'src/types/notion';
import { SWRConfig } from 'swr';

interface SlugProps {
  slug: string;
  fallback: {
    '/notion/blocks/children/list': IGetNotion;
    '/notion/pages': INotionSearchObject;
  };
}
const uuidRegex = /^[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/;

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
  return {
    paths: [],
    fallback: 'blocking'
  };
  // try {
  //   const databases = await fetch(
  //     config.origin + config.path + '/notion/databases/' + config.notion.baseDatabase
  //   ).then(async (res) => (await res.json()) as IResponseSuccess<NotionDatabasesQuery>);

  //   // axios
  //   // .get<IResponseSuccess<NotionDatabasesQuery>>(config.path + '/notion/databases/' + config.notion.baseDatabase)
  //   // .then((res) => res.data?.result?.results);

  //   if (!Array.isArray(databases)) {
  //     throw 'type error databases';
  //   }

  //   const paths = databases.map((page) => ({
  //     params: { slug: uuidRegex.test(page?.id) ? page.id.replaceAll('-', '') : page?.id }
  //   }));

  //   return {
  //     paths,
  //     fallback: 'blocking'
  //   };
  // } catch (e) {
  //   return {
  //     paths: [],
  //     fallback: 'blocking'
  //   };
  // }
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  try {
    if (typeof params?.slug !== 'string') {
      throw 'type error "slug"';
    }
    const slug = encodeURIComponent(
      uuidRegex.test(params.slug) ? params.slug.replaceAll('-', '') : params.slug
    );

    const pageInfo = await axios
      .get<IResponseSuccess<INotionSearch>>(
        `${config.origin}${config.path}/notion/search/${slug}?filterType=page`
      )
      .then(async ({ data }) => {
        const result = data?.result?.results?.[0];

        if (!result) {
          return await axios
            .get<IResponseSuccess<INotionSearch>>(
              `${config.origin}${config.path}/notion/search/${slug}?filterType=database`
            )
            .then(({ data }) => {
              const result = data?.result?.results?.[0];
              if (!result) {
                throw {
                  success: false
                };
              }
              return {
                success: true,
                result: result
              };
            });
        }

        return {
          success: true,
          result: result
        };
      });

    if (!pageInfo?.success || !pageInfo?.result?.id) {
      throw '';
    }

    const blocks = await (async function () {
      switch (pageInfo?.result?.object) {
        case 'database': {
          return await axios
            .get<IResponseSuccess<IGetNotion>>(
              config.origin + config.path + '/notion/databases/' + pageInfo.result.id,
              {
                params
              }
            )
            .then((res) => res.data);
        }
        case 'page': {
          return await axios
            .get<IResponseSuccess<IGetNotion>>(
              config.origin + config.path + '/notion/blocks/children/list/' + pageInfo.result.id,
              {
                params
              }
            )
            .then((res) => res.data);
        }
      }
    })();

    if (!blocks?.success) {
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
