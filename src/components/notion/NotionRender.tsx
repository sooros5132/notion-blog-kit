/* eslint-disable @next/next/no-img-element */
'use client';

import type React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { HiHome, HiMenu } from 'react-icons/hi';
import { siteConfig } from 'site-config';
import type {
  RichText,
  INotionPage,
  NotionDatabasesQuery,
  INotionSearchDatabase
} from 'src/types/notion';
import { NotionBlocksRender, NotionPageHeader, NotionSeo } from '.';
import { NotionDatabasePageView } from './lib';

export interface NotionRenderProps {
  slug: string;
  page: INotionPage;
}

// export const EllipsisWrapperBox = styled('div')({
//   overflow: 'hidden',
//   whiteSpace: 'nowrap',
//   maxHeight: '3.1em',
//   textOverflow: 'ellipsis',
//   '& p, a, span': {
//     display: '-webkit-box',
//     whiteSpace: 'normal',
//     WebkitBoxOrient: 'vertical',
//     WebkitLineClamp: '2'
//   }
// });

export const NotionRender: React.FC<NotionRenderProps> = (props) => {
  const baseBlock = props?.page?.block;
  const blocks = baseBlock.results;
  const pageInfo = props?.page?.pageInfo;
  const userInfo = props?.page?.userInfo;
  const slug = pageInfo?.id.replaceAll('-', '');

  if (!blocks || !props?.page.pageInfo) {
    return (
      <div className='flex-center'>
        <progress className='radial-progress'></progress>
      </div>
    );
  }

  const title =
    pageInfo.object === 'page'
      ? pageInfo?.properties?.title?.title?.map((text) => text?.plain_text).join('') || null
      : pageInfo.object === 'database'
      ? pageInfo.title?.map((text) => text?.plain_text).join('') || null
      : null;
  const description = blocks
    ?.slice(0, 10)
    ?.map((block: any) =>
      block?.[block.type]?.rich_text?.map((text: RichText) => text?.plain_text || '')?.join('')
    )
    ?.join(' ')
    .replace(/\n/gm, '');

  return (
    <div className='w-full mb-5 whitespace-pre-wrap'>
      <NotionSeo page={pageInfo} title={title} description={description} slug={slug} />
      <NotionPageHeader page={pageInfo} title={title} userInfo={userInfo} />
      <div className='max-w-[var(--article-max-width)] mx-auto mt-10 sm:px-4'>
        <div className={classNames(pageInfo.object === 'page' ? 'px-3' : null)}>
          {pageInfo.object === 'page' ? (
            <NotionBlocksRender baseBlock={baseBlock} blocks={blocks} />
          ) : pageInfo.object === 'database' ? (
            <NotionDatabasePageView
              pageInfo={pageInfo as INotionSearchDatabase}
              baseBlock={baseBlock as unknown as NotionDatabasesQuery}
            />
          ) : null}
        </div>
        <NotionFooter pageInfo={pageInfo} />
      </div>
    </div>
  );
};

const NotionFooter: React.FC<{ pageInfo: INotionPage['pageInfo'] }> = ({ pageInfo }) => {
  const parentDatabaseId = pageInfo.parent.database_id?.replaceAll('-', '') || '';

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
