import type React from 'react';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { siteConfig } from 'site-config';
import Link from 'next/link';
import { useState, memo, useEffect } from 'react';
import { SiNotion } from 'react-icons/si';
import { FileObject, NotionDatabase } from 'src/types/notion';
import isEqual from 'react-fast-compare';
import { NotionParagraphBlock, NotionSecureImage } from '.';
import { enUS } from 'date-fns/locale';
import { richTextToPlainText } from './utils';

export const ChildDatabaseItem: React.FC<{
  block: NotionDatabase;
  sortKey: 'created_time' | 'last_edited_time' | 'title';
}> = memo(({ block, sortKey }) => {
  const [isMounted, setMounted] = useState(false);
  const slug = richTextToPlainText(
    block?.properties?.slug?.rich_text || block?.properties?.title?.title
  );

  const parentDatabaseId = block?.parent?.database_id?.replaceAll('-', '');

  const href =
    parentDatabaseId === siteConfig.notion.baseBlock
      ? `/${encodeURIComponent(slug)}`
      : `/${encodeURIComponent(block.id.replaceAll('-', ''))}/${encodeURIComponent(
          slug || 'Untitled'
        )}`;

  const date = isMounted
    ? formatDistance(
        utcToZonedTime(
          new Date(block[sortKey === 'last_edited_time' ? 'last_edited_time' : 'created_time']),
          siteConfig.TZ
        ),
        utcToZonedTime(new Date(), siteConfig.TZ),
        {
          locale: enUS,
          addSuffix: true
        }
      )
    : (block?.created_time &&
        formatInTimeZone(new Date(block.created_time), siteConfig.TZ, 'yyyy-MM-dd', {
          locale: enUS
        })) ??
      undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className='rounded-xl min-w-[100px] bg-base-content/5 isolate overflow-hidden [&>a>.page-cover]:brightness-90 [&:hover>a>.page-cover]:brightness-100 [&:hover>a>.page-cover>div>img]:scale-[1.05] [&:hover>a>.page-cover>.notion-database-item-empty-cover]:scale-[1.05]'>
        <Link href={href}>
          <div className='page-cover h-48 transition-[filter] duration-200 ease-linear bg-base-content/5 overflow-hidden [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full [&>div>img]:trasnition-transform [&>div>img]:duration-200 [&>div>img]:ease-linear'>
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
                <div className='notion-database-item-empty-cover text-base-content/10'>
                  <SiNotion />
                </div>
              )
            ) : (
              <div className='notion-database-item-empty-cover text-base-content/10'>
                <SiNotion />
              </div>
            )}
          </div>
          <div className='flex items-center justify-between px-3 py-2 gap-x-2'>
            <div className='overflow-hidden max-h-[3.3em] [&>div]:line-clamp-2'>
              {block?.properties?.title?.title && (
                <NotionParagraphBlock
                  blockId={block.id}
                  richText={block?.properties?.title?.title}
                />
              )}
            </div>
            <div className='whitespace-nowrap'>
              <p>{date}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}, isEqual);

ChildDatabaseItem.displayName = 'ChildDatabaseItem';
