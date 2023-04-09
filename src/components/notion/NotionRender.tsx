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
  NotionPageBlocks,
  NotionBlocksRetrieve
} from 'src/types/notion';
import { NotionBlocksRender, NotionPageHeader, NotionSeo } from '.';
import { NotionDatabasePageView } from './lib';
import { richTextToPlainText } from './lib/utils';

export interface NotionRenderProps {
  slug: string;
  notionBlock: GetNotionBlock;
}

export const NotionRender: React.FC<NotionRenderProps> = (props) => {
  const baseBlock = props?.notionBlock?.block;
  const blocks = baseBlock.results;
  const pageInfo = props?.notionBlock.pageInfo;
  const userInfo = props?.notionBlock?.userInfo;

  if (!blocks || !props?.notionBlock) {
    return (
      <div className='flex-center'>
        <progress className='radial-progress'></progress>
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
    <div className='w-full mb-5 whitespace-pre-wrap'>
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

  if (!parentDatabaseId) {
    return <></>;
  }

  return (
    <div>
      <div className='divider'></div>
      <div className='flex justify-between m-2'>
        <Link
          className='btn btn-sm btn-ghost text-zinc-500'
          href={parentDatabaseId === siteConfig.notion.baseBlock ? '/' : `/${parentDatabaseId}`}
        >
          <HiHome /> Home
        </Link>
        <Link
          className='btn btn-sm btn-ghost text-zinc-500'
          href={parentDatabaseId === siteConfig.notion.baseBlock ? '/' : `/${parentDatabaseId}`}
        >
          <HiMenu /> Post List
        </Link>
      </div>
    </div>
  );
};
