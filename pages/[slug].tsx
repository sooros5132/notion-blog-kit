import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import {
  INotionPage,
  INotionSearchObject,
  NotionDatabase,
  URL_PAGE_TITLE_MAX_LENGTH
} from 'src/types/notion';
import { NotionClient } from 'lib/notion/Notion';
import { useNotionStore } from 'src/store/notion';

interface SlugProps {
  slug: string;
  page: INotionPage;
}

export default function Slug({ slug, page }: SlugProps) {
  useNotionStore.setState({
    slug,
    baseBlock: page.block,
    childrenRecord: page?.block?.childrenRecord || {},
    databaseRecord: page?.block?.databaseRecord || {}
  });

  //! key 지우면 에러가 남. https://reactjs.org/link/setstate-in-render
  return <NotionRender key={slug} slug={slug} page={page} />;
}
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const searchPage = async (slug: string) => {
  const notionClient = new NotionClient();

  // pageId로 먼저 page 검색 database인 경우 오류가 발생.
  const pageInfo = await notionClient.getPageInfoByPageId(slug).then(async (res) => {
    if (res) return res;

    //! database id를 종종 page에서 찾아내는 경우가 발생 함. database 우선 검색
    return await notionClient.getDatabaseInfoByBlockId(slug).then(async (res) => {
      const result = res;

      if (!result) {
        return await notionClient
          .getSearchPagesByPageId({
            searchValue: slug,
            filterType: 'page'
          })
          .then((res) => {
            return res?.results?.[0];
          });
      }
      return result;
    });
  });

  return pageInfo as INotionSearchObject;
};

const getBlock = async (blockId: string, type: 'database' | 'page'): Promise<INotionPage> => {
  const notionClient = new NotionClient();

  // const page = await notionClient.getPageByPageId(blockId);
  switch (type) {
    case 'database': {
      const database = await notionClient.getDatabaseByDatabaseId(blockId);

      return database;
    }
    case 'page': {
      const page = await notionClient.getPageByPageId(blockId);
      return page;
    }
  }

  // return await notionClient.getPageByPageId(blockId);
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const notionClient = new NotionClient();

  const databases: Array<INotionSearchObject> = [];
  {
    // 모든 db 가져오기
    let has_more = false;
    let next_cursor = null;
    do {
      const database = await notionClient.getSearchPagesByPageId({
        filterType: 'database',
        searchValue: ''
      });
      has_more = database.has_more;
      next_cursor = database.next_cursor;

      if (Array.isArray(database.results)) {
        databases.push(...database.results);
      }
    } while (next_cursor && has_more);
  }

  const paths: Awaited<ReturnType<GetStaticPaths<{ slug: string }>>>['paths'] = [];

  for (const database of databases) {
    const pages: Array<NotionDatabase> = [];
    {
      // 데이터베이스에 있는 모든 page 가져오기
      let has_more = false;
      let next_cursor = null;
      do {
        const databaseInPages = await notionClient.getPagesInDatabaseByDatabaseId(database.id);
        has_more = databaseInPages.has_more;
        next_cursor = databaseInPages.next_cursor;

        if (Array.isArray(databaseInPages.results)) {
          pages.push(...databaseInPages.results);
        }
      } while (next_cursor && has_more);
    }

    for (const page of pages) {
      const title =
        page.object === 'page'
          ? page?.properties?.title?.title
              ?.map((text) => text?.plain_text)
              .join('')
              .slice(0, URL_PAGE_TITLE_MAX_LENGTH) || ''
          : '';

      if (title && typeof title === 'string') {
        paths.push({
          params: {
            slug: `${title ? title + '-' : ''}${page.id.replaceAll('-', '')}`
          }
        });
      }
    }
  }

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  try {
    if (typeof params?.slug !== 'string') {
      throw 'type error "slug"';
    }
    const slug = encodeURIComponent(
      uuidRegex.test(params.slug)
        ? params.slug.replaceAll('-', '')
        : (/-?[-a-f0-9]+$/i.exec(params.slug)?.[0] || params.slug).replaceAll('-', '').slice(-32)
    );

    const pageInfo = await searchPage(slug);

    if (!pageInfo?.id) {
      throw '';
    }

    const page = await getBlock(slug, pageInfo.object);

    return {
      props: {
        slug,
        page
      },
      revalidate: 600
    };
  } catch (e) {
    if (typeof params?.slug === 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/s/' + encodeURIComponent(params.slug.replace(/-[-a-f0-9]+$/i, ''))
        }
      };
    }
    return {
      notFound: true
    };
  }
};
