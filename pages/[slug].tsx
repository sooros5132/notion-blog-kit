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
  const router = useRouter();

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
  const notionClient = new NotionClient();

  const paths: Awaited<ReturnType<GetStaticPaths<{ slug: string }>>>['paths'] = [];

  const database = await notionClient.getAllPublishedPageInDatabase({
    databaseId: config.notion.baseBlock
  });
  database.results.forEach((page) => {
    const slug = page.properties.slug?.rich_text
      ?.map((text) => text.plain_text.trim())
      .join('')
      .slice(0, URL_PAGE_TITLE_MAX_LENGTH);

    if (slug) {
      paths.push({ params: { slug: slug } });
    }
  });

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<SlugProps> = async ({ params }) => {
  const slug = params?.slug;
  try {
    if (typeof slug !== 'string') {
      throw 'type error "slug"';
    }
    if (slug === config.notion.baseBlock) {
      return {
        redirect: {
          permanent: false,
          destination: `/`
        }
      };
    }

    const notionClient = new NotionClient();

    {
      // slug 검색
      const pageInfo = await notionClient.searchSlug({
        slug,
        property: 'slug'
      });

      if (pageInfo) {
        const page = await getBlock(pageInfo.id, pageInfo.object);

        return {
          props: {
            slug,
            page
          },
          revalidate: 600
        };
      }
    }

    {
      // title 검색
      const pageInfo = (await notionClient.searchSlug({
        slug,
        property: 'title'
      })) as INotionPage['pageInfo'];

      if (pageInfo) {
        if (pageInfo.parent.database_id?.replaceAll('-', '') === config.notion.baseBlock) {
          const newSlug = richTextToPlainText(pageInfo.properties.slug?.rich_text);
          if (newSlug) {
            return {
              redirect: {
                permanent: false,
                destination: `/${encodeURIComponent(newSlug)}`
              }
            };
          }
        }
        const page = await getBlock(pageInfo.id, pageInfo.object);

        return {
          props: {
            slug,
            page
          },
          revalidate: 120
        };
      }
    }

    {
      // uuid로 찾기
      const [pageInfo, databaseInfo] = await Promise.all([
        notionClient.getPageInfo({
          pageId: slug
        }),
        notionClient.getDatabaseInfo({
          databaseId: slug
        })
      ]);
      const page = pageInfo || databaseInfo;

      if (!page.object) {
        throw 'page is not found';
      }

      const searchedPageSlug =
        page.object === 'page' ? richTextToPlainText(page?.properties?.slug?.rich_text) : '';

      if (searchedPageSlug) {
        return {
          redirect: {
            permanent: false,
            destination: `/${encodeURIComponent(searchedPageSlug)}`
          }
        };
      }
    }

    throw 'page is not found';
  } catch (e) {
    if (typeof slug === 'string') {
      return {
        redirect: {
          permanent: false,
          destination: '/s/' + encodeURIComponent(slug)
        }
      };
    }
    return {
      notFound: true
    };
  }
};
