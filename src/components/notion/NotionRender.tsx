/* eslint-disable @next/next/no-img-element */
'use client';

import classNames from 'classnames';
import type React from 'react';
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
              key={Date.now()}
              pageInfo={pageInfo as INotionSearchDatabase}
              baseBlock={baseBlock as unknown as NotionDatabasesQuery}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
