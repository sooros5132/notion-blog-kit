'use client';

import Link from 'next/link';
import { memo } from 'react';
import { SiNotion } from 'react-icons/si';
import { FileObject, NotionDatabasesRetrieve, NotionPagesRetrieve } from '@/types/notion';
import isEqual from 'react-fast-compare';
import { NotionSecureImage } from '.';
import { richTextToPlainText } from './utils';
import { siteConfig } from '@/lib/site-config';
import { zonedTimeToUtc } from 'date-fns-tz';
import { DateTimeFormat } from '@/components/modules/DateTimeFormat';

export const ChildDatabaseItem: React.FC<{
  block: NotionPagesRetrieve | NotionDatabasesRetrieve;
  sortKey: 'created_time' | 'last_edited_time' | 'title';
}> = memo(({ block, sortKey }) => {
  const slug = richTextToPlainText(
    block?.properties?.slug?.rich_text || block?.properties?.title?.title
  );
  const title = richTextToPlainText(
    block.object === 'page'
      ? block?.properties?.title?.title || block?.properties?.slug?.rich_text
      : block.title
  );

  const parentDatabaseId = block?.parent?.database_id?.replaceAll('-', '');

  const href =
    parentDatabaseId === siteConfig.notion.baseBlock
      ? `/${slug}`
      : `/${block.id.replaceAll('-', '')}/${slug || title || 'Untitled'}`;

  const _publishedAt = block?.properties?.publishedAt?.date?.start || block?.created_time || null;
  const publishedAt = _publishedAt ? zonedTimeToUtc(new Date(_publishedAt), siteConfig.TZ) : null;

  return (
    // borderRadius: theme.size.px10,
    // minWidth: 100,
    // backgroundColor: theme.color.cardBackground,
    // /**
    //  * Safari 브라우저 borderRadius 오류.
    //  * 쌓임 맥락에 추가 https://www.sungikchoi.com/blog/safari-overflow-border-radius/
    //  * isolation: isolate
    //  * will-change: transform;
    //  * 추가하기
    //  */
    // isolation: 'isolate',
    // overflow: 'hidden',
    // '& .page-cover': {
    //   filter: 'brightness(0.75)'
    // },
    // '&:hover .page-cover': {
    //   filter: 'brightness(1)',
    //   '& .image': {
    //     transform: 'scale(1.05)'
    //   }
    // }
    <div>
      <div className='min-w-[100px] rounded-xl bg-foreground/5 isolate overflow-hidden [&>a>.page-cover]:brightness-90 [&:hover>a>.page-cover]:brightness-100 [&:hover>a>.page-cover>div>img]:scale-[1.05] [&:hover>a>.page-cover>.notion-database-item-empty-cover]:scale-[1.05]'>
        <Link href={href}>
          <div className='page-cover h-48 transition-[filter] duration-200 ease-linear bg-foreground/5 overflow-hidden [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full [&>div>img]:trasnition-transform [&>div>img]:duration-200 [&>div>img]:ease-linear'>
            {block?.cover ? (
              <NotionSecureImage
                useNextImage
                blockId={block.id}
                blockType={'page'}
                useType={'cover'}
                initialFileObject={block?.cover}
                alt={'page-cover'}
              />
            ) : block?.icon ? (
              block?.icon?.emoji ? (
                <div className='notion-database-item-empty-cover'>{block?.icon?.emoji}</div>
              ) : block?.icon?.file ? (
                <NotionSecureImage
                  useNextImage
                  blockId={block.id}
                  blockType={'page'}
                  useType={'icon'}
                  initialFileObject={block?.icon as FileObject}
                  alt={'page-icon'}
                />
              ) : (
                <div className='notion-database-item-empty-cover text-foreground/5'>
                  <SiNotion />
                </div>
              )
            ) : (
              <div className='notion-database-item-empty-cover text-foreground/5'>
                <SiNotion />
              </div>
            )}
          </div>
          <div className='flex items-center justify-between px-3 py-2 gap-x-2'>
            <div className='overflow-hidden max-h-[3.3em] [&>div]:line-clamp-2'>{title}</div>
            {publishedAt && (
              <span className='group text-zinc-500 whitespace-nowrap'>
                <span className='inline group-hover:hidden'>
                  <DateTimeFormat date={publishedAt} relativeTime={{ now: true }} />
                </span>
                <span className='hidden group-hover:inline'>
                  <DateTimeFormat date={publishedAt} />
                </span>
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}, isEqual);

ChildDatabaseItem.displayName = 'ChildDatabaseItem';
