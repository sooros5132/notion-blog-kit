/* eslint-disable @next/next/no-img-element */
'use client';

import type React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { HiHome, HiMenu } from 'react-icons/hi';
import { siteConfig } from 'site-config';
import type {
  RichText,
  GetNotionBlock,
  NotionDatabaseBlocks,
  NotionBlocksRetrieve
} from 'src/types/notion';
import { NotionBlocksRender, NotionPageHeader, NotionSeo } from '.';
import { NotionDatabasePageView } from './lib';
import { richTextToPlainText } from './lib/utils';
import { useNotionStore } from 'src/store/notion';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import shallow from 'zustand/shallow';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotionRenderProps {
  // notionBlock: GetNotionBlock;
}

export const NotionRender: React.FC<NotionRenderProps> = () => {
  const { baseBlock, pageInfo, userInfo } = useNotionStore((state) => state, shallow);

  const blocks = baseBlock?.results;

  if (!blocks || !pageInfo) {
    return (
      <div className='flex-center flex-col mx-auto mt-8 gap-y-4 text-xl text-zinc-500'>
        <Link className='btn btn-sm' href={'/'}>
          <HiHome /> Home
        </Link>
        <div>404 Not Found </div>
      </div>
    );
  }

  const title =
    richTextToPlainText(
      pageInfo.object === 'database' ? pageInfo.title : pageInfo.properties?.title?.title
    ) || '';

  const description = blocks
    ?.slice(0, 10)
    ?.map((block: any) =>
      block?.[block.type]?.rich_text?.map((text: RichText) => text?.plain_text || '')?.join('')
    )
    ?.join(' ')
    .replace(/\n/gm, '');

  return (
    //! Don't delete key
    <div key={pageInfo.id} className='w-full mb-5 whitespace-pre-wrap'>
      <NotionSeo page={pageInfo} title={title} description={description} />
      <NotionPageHeader pageInfo={pageInfo} title={title} userInfo={userInfo} />
      <div className='max-w-[var(--article-max-width)] mx-auto mt-10 sm:px-4'>
        <div className={classNames(pageInfo ? 'px-3' : null)}>
          {pageInfo.object === 'page' ? (
            <NotionBlocksRender blocks={blocks as Array<NotionBlocksRetrieve>} />
          ) : pageInfo.object === 'database' ? (
            <NotionDatabasePageView
              databaseInfo={pageInfo}
              notionBlock={baseBlock as NotionDatabaseBlocks}
            />
          ) : null}
        </div>
        <NotionFooter pageInfo={pageInfo} />
      </div>
    </div>
  );
};

const NotionFooter: React.FC<{
  pageInfo: GetNotionBlock['pageInfo'];
}> = ({ pageInfo }) => {
  const parentDatabaseId = pageInfo?.parent.database_id?.replaceAll('-', '') || '';
  const blogArticleRelation = useNotionStore((state) => state.blogArticleRelation);

  if (!parentDatabaseId) {
    return <></>;
  }

  const pageId = pageInfo.id.replaceAll('-', '');
  const parentIsBaseDatabase = parentDatabaseId == siteConfig.notion.baseBlock;
  const havePrev =
    blogArticleRelation &&
    blogArticleRelation?.prev &&
    parentIsBaseDatabase &&
    pageId === blogArticleRelation.id;
  const haveNext =
    blogArticleRelation &&
    blogArticleRelation?.next &&
    parentIsBaseDatabase &&
    pageId === blogArticleRelation.id;

  return (
    <div>
      <div className='divider'></div>
      <div className='m-2 flex flex-col gap-3 [&>a]:normal-case sm:flex-row text-base'>
        <div className='basis-1/2 shrink-0'>
          {haveNext && (
            <Link
              className='flex items-center gap-x-4 py-2 px-4 text-zinc-500 bg-base-content/5 hover:bg-base-content/10 rounded-md shadow-md '
              href={`/${
                blogArticleRelation.next?.slug ||
                blogArticleRelation.next?.title ||
                blogArticleRelation.next?.id
              }`}
            >
              <GrLinkPrevious className='shrink-0 text-[1.3em] [&>path]:stroke-current' />
              <div>
                <div className='text-sm select-none'>Next</div>
                <div className='break-all text-base-content font-bold'>
                  {blogArticleRelation.next?.title}
                </div>
              </div>
            </Link>
          )}
        </div>
        <div className='basis-1/2 shrink-0'>
          {havePrev && (
            <Link
              className='flex items-center gap-x-4 py-2 px-4 text-zinc-500 bg-base-content/5 hover:bg-base-content/10 rounded-md shadow-md '
              href={`/${
                blogArticleRelation.prev?.slug ||
                blogArticleRelation.prev?.title ||
                blogArticleRelation.prev?.id
              }`}
            >
              <div className='grow text-right'>
                <div className='text-sm select-none'>Prev</div>
                <div className='break-all text-base-content font-bold'>
                  {blogArticleRelation.prev?.title}
                </div>
              </div>
              <GrLinkNext className='shrink-0 text-[1.3em] [&>path]:stroke-current' />
            </Link>
          )}
        </div>
      </div>
      <div className='flex justify-between m-2 mt-6 [&>a]:normal-case'>
        {/* <Link
          className='btn btn-sm text-zinc-500 shadow-md bg-base-content/5 hover:bg-base-content/10 border-0'
          href={parentIsBaseDatabase ? '/' : `/${parentDatabaseId}`}
        >
          <HiHome /> Home
        </Link> */}
        <Link
          className='ml-auto btn btn-sm text-zinc-500 shadow-md bg-base-content/5 hover:bg-base-content/10 border-0'
          href={parentDatabaseId === siteConfig.notion.baseBlock ? '/' : `/${parentDatabaseId}`}
        >
          <HiMenu /> Post List
        </Link>
      </div>
    </div>
  );
};
