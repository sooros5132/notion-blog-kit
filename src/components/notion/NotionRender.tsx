/* eslint-disable @next/next/no-img-element */
'use client';

import classNames from 'classnames';
import type React from 'react';
import type {
  NotionBlock,
  RichText,
  INotionSearchObject,
  INotionPage,
  NotionDatabasesQuery
} from 'src/types/notion';
import { NotionBlocksRender, NotionChildDatabaseBlock, NotionPageHeader, NotionSeo } from '.';
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
      <div className='max-w-[var(--article-max-width)] mx-auto mt-10 sm:px-4 lg:px-6'>
        <div className={classNames('[&>*]:m-0.5', pageInfo.object === 'page' ? 'px-3' : null)}>
          {pageInfo.object === 'page' ? (
            <NotionBlocksRender baseBlock={baseBlock} blocks={blocks} />
          ) : pageInfo.object === 'database' ? (
            <NotionDatabasePageView
              pageInfo={pageInfo}
              baseBlock={baseBlock as unknown as NotionDatabasesQuery}
            />
          ) : // <NotionChildDatabaseBlock
          //   //! key로 useState 초기화 + 리렌더링 강제유발
          //   key={pageInfo.id}
          //   //! key로 useState 초기화 + 리렌더링 강제유발
          //   block={
          //     {
          //       ...pageInfo,
          //       child_database: {
          //         title: title
          //       }
          //     } as unknown as NotionBlock
          //   }
          // />
          null}
        </div>
        {/* {pageInfo?.id && <NotionHits pageInfo={pageInfo} />} */}
      </div>
    </div>
  );
};

const NotionHits: React.FC<{ pageInfo: INotionSearchObject }> = ({ pageInfo }) => {
  return (
    <div className='flex justify-end pt-5'>
      {process.env.NODE_ENV === 'production' ? (
        <img
          src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent(
            `/${pageInfo.id}`
          )}&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false`}
          alt='seeyoufarm'
        />
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='75'
          height='20'
        >
          <linearGradient id='smooth' x2='0' y2='100%'>
            <stop offset='0' stopColor='#bbb' stopOpacity='.1' />
            <stop offset='1' stopOpacity='.1' />
          </linearGradient>

          <mask id='round'>
            <rect width='75' height='20' rx='3' ry='3' fill='#fff' />
          </mask>

          <g mask='url(#round)'>
            <rect width='30' height='20' fill='#555555' />
            <rect x='30' width='45' height='20' fill='#79C83D' />
            <rect width='75' height='20' fill='url(#smooth)' />
          </g>

          <g
            fill='#fff'
            textAnchor='middle'
            fontFamily='Verdana,DejaVu Sans,Geneva,sans-serif'
            fontSize='11'
          >
            <text x='16' y='15' fill='#010101' fillOpacity='.3'>
              hits
            </text>
            <text x='16' y='14' fill='#fff'>
              hits
            </text>
            <text x='51.5' y='15' fill='#010101' fillOpacity='.3'>
              {' '}
              1 / 1{' '}
            </text>
            <text x='51.5' y='14' fill='#fff'>
              {' '}
              1 / 1{' '}
            </text>
          </g>
        </svg>
      )}
    </div>
  );
};
