'use client';

import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import type { GetNotionBlock, NotionDatabaseBlocks, NotionBlocksRetrieve } from '@/types/notion';
import { NotionBlocksRender, NotionPageHeader } from '.';
import { NotionDatabasePageView } from './lib';
import { richTextToPlainText } from './lib/utils';
import { Button } from '../ui/button';
import { NotionLayout } from './lib/NotionLayout';
import { NotionPageFooter, NotionPageFooterViewArchive } from './lib/NotionPageFooter';
import { UtterancesComments } from '../modules/Utterances';
import { siteConfig } from '@/lib/site-config';
import { GiscusComments } from '../modules/Giscus';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotionRenderProps {
  notionBlock: GetNotionBlock;
}

export function NotionRender({ notionBlock }: NotionRenderProps) {
  const { block: baseBlock, pageInfo, userInfo } = notionBlock;

  const blocks = baseBlock?.results;

  if (!blocks || !pageInfo) {
    return (
      <div className='flex-center flex-col mx-auto mt-8 gap-y-4 text-3xl text-zinc-500'>
        <div>404 Not Found </div>
        <Link href={'/'}>
          <Button>
            <HiHome /> Home
          </Button>
        </Link>
      </div>
    );
  }

  const title =
    richTextToPlainText(
      pageInfo.object === 'database' ? pageInfo.title : pageInfo.properties?.title?.title
    ) || '';

  // const description = blocks
  //   ?.slice(0, 10)
  //   ?.map((block: any) =>
  //     block?.[block.type]?.rich_text?.map((text: RichText) => text?.plain_text || '')?.join('')
  //   )
  //   ?.join(' ')
  //   .replace(/\n/gm, '');

  return (
    //! Don't delete key
    <div key={pageInfo.id} className='w-full whitespace-normal'>
      {/* <NotionSeo page={pageInfo} title={title} description={description} /> */}
      <NotionPageHeader pageInfo={pageInfo} title={title} userInfo={userInfo} />
      <NotionLayout>
        {pageInfo.object === 'page' ? (
          <NotionBlocksRender
            blocks={blocks as Array<NotionBlocksRetrieve>}
            childrensRecord={baseBlock.childrensRecord}
            databasesRecord={baseBlock.databasesRecord}
          />
        ) : pageInfo.object === 'database' ? (
          <NotionDatabasePageView
            databaseInfo={pageInfo}
            notionBlock={baseBlock as NotionDatabaseBlocks}
          />
        ) : null}
      </NotionLayout>
      {pageInfo.object === 'page' && (
        <div className='mt-10 bg-card/60 dark:bg-card/50'>
          <div className='max-w-article mx-auto py-10 space-y-10'>
            {siteConfig.giscus.repo && siteConfig.giscus.repoId ? (
              <div className='mx-4'>
                <GiscusComments />
              </div>
            ) : siteConfig.utterances.repo ? (
              <div className='mx-4'>
                <UtterancesComments />
              </div>
            ) : null}
            <div className='space-y-3'>
              <NotionPageFooterViewArchive pageInfo={pageInfo} />
              <NotionPageFooter pageInfo={pageInfo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
