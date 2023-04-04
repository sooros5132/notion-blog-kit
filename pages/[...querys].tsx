import type React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { NotionRender } from 'src/components/notion';
import { INotionPage, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
import { NotionClient } from 'lib/notion/Notion';
import { useNotionStore } from 'src/store/notion';
import config from 'site-config';
import { richTextToPlainText } from 'src/components/notion/lib/utils';
import { useRouter } from 'next/router';

interface SlugProps {
  slug: string;
  page: INotionPage;
}

export default function Slug({ slug, page }: SlugProps) {
  // return <div>hello world</div>;

  useNotionStore.setState({
    slug,
    baseBlock: page.block,
    pageInfo: page.pageInfo,
    userInfo: page.userInfo,
    childrenRecord: page?.block?.childrenRecord || {},
    databaseRecord: page?.block?.databaseRecord || {}
  });

  return <NotionRender slug={slug} page={page} />;
}

const getBlock = async (blockId: string, type: 'database' | 'page'): Promise<INotionPage> => {
  const notionClient = new NotionClient();

  switch (type) {
    case 'database': {
      const database = await notionClient.getBlogMainPage({ databaseId: blockId });

      return database;
    }
    case 'page': {
      const page = await notionClient.getPageByPageId(blockId);
      return page;
    }
  }
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  const uuid = params?.querys?.[0]?.replaceAll('-', '');
  const slug = params?.querys?.[1];
  try {
    if (typeof uuid !== 'string') {
      throw 'type error "uuid"';
    }
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (uuid === config.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
    }

    const notionClient = new NotionClient();

    {
      // uuid로 찾기
      const [pageInfo, databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: uuid
        }),
        notionClient.getDatabaseInfo({
          databaseId: uuid
        })
      ]);
      const page = pageInfo || databaseInfo || {};

      if (!page.object || (page.object !== 'page' && page.object !== 'database')) {
        throw 'page is not found';
      }

      const searchedPageSlug =
        page?.object === 'page' ? richTextToPlainText(page?.properties?.slug?.rich_text) : '';

      if (page?.parent?.database_id?.replaceAll('-', '') === config.notion.baseBlock) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(searchedPageSlug)}`
          }
        };
      }

      const block = await getBlock(page.id, page.object);

      if (!block) {
        throw 'page is not found';
      }

      return {
        props: {
          page: block,
          slug: uuid
        }
      };
    }
  } catch (e) {
    if (uuid && slug) {
      return {
        redirect: {
          permanent: false,
          destination: `/s/${encodeURIComponent(uuid + ' ' + slug)}`
        }
      };
    }
    return {
      notFound: true
    };
  }
};
