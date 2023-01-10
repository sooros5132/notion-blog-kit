import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import {
  IGetNotion,
  INotionSearchObject,
  INotionUserInfo,
  URL_PAGE_TITLE_MAX_LENGTH
} from 'src/types/notion';
import { NotionService } from 'src-server/service/Notion';
import config from 'site-config';

interface SlugProps extends IGetNotion {
  slug: string;
  pageInfo: INotionSearchObject;
  userInfo: INotionUserInfo | null;
}

export default function Slug({
  slug,
  blocks,
  childrenBlocks,
  databaseBlocks,
  pageInfo,
  userInfo
}: SlugProps) {
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
}
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const searchPage = async (slug: string) => {
  const notionService = new NotionService();

  // pageId로 먼저 page 검색 database인 경우 오류가 발생.
  const pageInfo = await notionService
    .getPageInfoByPageId(slug)
    //! 못 찾으면 에러로 나옴.
    .catch(async () => {
      //! database id를 종종 page에서 찾아내는 경우가 발생 함. database 우선 검색
      return await notionService
        .getSearchPagesByPageId({
          searchValue: slug,
          filterType: 'database'
        })
        .then(async (res) => {
          const result = res?.results?.[0];

          if (!result) {
            return await notionService
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

const getBlocks = async (id: string, type: 'database' | 'page') => {
  const notionService = new NotionService();

  switch (type) {
    case 'database': {
      const database = {
        blocks: (await notionService.getDatabasesById(id)) as unknown as IGetNotion['blocks'],
        databaseBlocks: {},
        childrenBlocks: {}
      };

      return database;
    }
    case 'page': {
      const blocks = await notionService.getAllBlocksAndChildrens(id);
      return blocks;
    }
  }
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  if (!Array.isArray(config.headerNav) || config.headerNav.length === 0) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }

  const notionSevice = new NotionService();
  const paths: Awaited<ReturnType<GetStaticPaths<{ slug: string }>>>['paths'] = [];

  for await (const database of config.headerNav) {
    const pageInfo = await notionSevice.getSearchPagesByPageId({
      filterType: 'database',
      searchValue: database.slug
    });

    for (const page of pageInfo.results) {
      switch (page.object) {
        case 'database': {
          const database = page;
          const databaseItems = await getBlocks(database.id, database.object);
          const pages = databaseItems?.blocks?.results as unknown as INotionSearchObject[];
          if (!Array.isArray(pages) || pages.length === 0) {
            continue;
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
          break;
        }

        case 'page': {
          break;
        }
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
        : params.slug.replaceAll('-', '').slice(-32)
    );

    const pageInfo = await searchPage(slug);

    if (!pageInfo?.id) {
      throw '';
    }
    const [blocks, userInfo] = await Promise.all([
      getBlocks(slug, pageInfo.object),
      new NotionService().getUserProfile(pageInfo.created_by.id)
    ]);

    return {
      props: {
        slug,
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
