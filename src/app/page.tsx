import { NotionClient } from '@/server/notion/Notion';
import { siteConfig } from '@/lib/site-config';
import { NotionPageHeader, NotionRender } from '@/components/notion';
import { richTextToPlainText } from '@/components/notion/lib/utils';
import { NotionMagazineView } from '@/components/notion/lib/NotionMagaginView';
import { GetNotionBlock, NotionDatabaseBlocks, NotionDatabasesRetrieve } from '@/types/notion';
import { NotionLayout } from '@/components/notion/lib/NotionLayout';
import { NotionStoreProvider } from '@/store/notion';
import { REVALIDATE } from '@/lib/notion';

export const revalidate = REVALIDATE;

async function getHomeData() {
  try {
    const notionClient = new NotionClient();
    const database = await notionClient.getMainDatabase(17);
    const blogProperties = await notionClient.getBlogProperties();

    return {
      slug: siteConfig.notion.baseBlock,
      notionBlock: database,
      blogProperties
    };
  } catch (e) {
    throw '';
  }
}

export default async function Home() {
  const { slug, blogProperties, notionBlock } = await getHomeData();

  const pageInfo = notionBlock?.pageInfo;

  const store = {
    slug,
    blogProperties,
    baseBlock: notionBlock.block,
    userInfo: notionBlock.userInfo,
    pageInfo: notionBlock.pageInfo,
    childrensRecord: notionBlock.block.childrensRecord,
    databasesRecord: notionBlock.block.databasesRecord
  };

  switch (pageInfo.object) {
    case 'database': {
      return (
        <NotionStoreProvider store={store}>
          <MagazineRender notionBlock={notionBlock} />
        </NotionStoreProvider>
      );
    }
    case 'page': {
      return (
        <NotionStoreProvider store={store}>
          <NotionRender notionBlock={notionBlock} />
        </NotionStoreProvider>
      );
    }
    default: {
      return (
        <>
          This type of page is not supported. It only supports page or database page. Please check
          the notion page you want to create as a blog.
        </>
      );
    }
  }
}

function MagazineRender({ notionBlock }: { notionBlock: GetNotionBlock }) {
  const userInfo = notionBlock?.userInfo;
  const pageInfo = notionBlock?.pageInfo;

  const title =
    richTextToPlainText(
      pageInfo.object === 'database' ? pageInfo.title : pageInfo.properties?.title?.title
    ) || '';

  return (
    <>
      <NotionPageHeader pageInfo={pageInfo} title={title} userInfo={userInfo} />
      <NotionLayout>
        <NotionMagazineView
          databaseInfo={pageInfo as NotionDatabasesRetrieve}
          notionBlock={notionBlock.block as NotionDatabaseBlocks}
        />
      </NotionLayout>
    </>
  );
}
