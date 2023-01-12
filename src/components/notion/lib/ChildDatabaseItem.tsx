import type React from 'react';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import config from 'site-config';
import Link from 'next/link';
import { useState, useMemo, memo, useEffect } from 'react';
import { SiNotion } from 'react-icons/si';
import { NotionDatabase, URL_PAGE_TITLE_MAX_LENGTH } from 'src/types/notion';
import isEqual from 'react-fast-compare';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';
import { ko as koLocale } from 'date-fns/locale';

export const ChildDatabaseItem: React.FC<{
  block: NotionDatabase;
  sortKey: 'created_time' | 'last_edited_time' | 'title';
}> = memo(({ block, sortKey }) => {
  const [isMounted, setMounted] = useState(false);
  const title = useMemo(
    () => block?.properties?.title?.title?.map((t) => t?.plain_text).join('') || null,
    [block?.properties?.title?.title]
  );

  const date = isMounted
    ? formatDistance(
        utcToZonedTime(
          new Date(block[sortKey === 'last_edited_time' ? 'last_edited_time' : 'created_time']),
          config.TZ
        ),
        utcToZonedTime(new Date(), config.TZ),
        {
          locale: koLocale,
          addSuffix: true
        }
      )
    : (block?.created_time &&
        formatInTimeZone(new Date(block.created_time), config.TZ, 'yyyy-MM-dd', {
          locale: koLocale
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
        <Link
          href={
            title
              ? `/${encodeURIComponent(
                  title.slice(0, URL_PAGE_TITLE_MAX_LENGTH)
                )}-${block.id.replaceAll('-', '')}`
              : `/${block.id.replaceAll('-', '')}`
          }
        >
          <div className='page-cover h-48 transition-[filter] duration-200 ease-linear bg-base-content/5 overflow-hidden [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full [&>div>img]:trasnition-transform [&>div>img]:duration-200 [&>div>img]:ease-linear'>
            {block?.cover ? (
              <NotionSecureImage
                src={block?.cover?.file?.url ?? block?.cover?.external?.url ?? ''}
                blockId={block.id}
                alt={'page-cover'}
              />
            ) : block?.icon ? (
              block?.icon?.emoji ? (
                <div className='notion-database-item-empty-cover'>{block?.icon?.emoji}</div>
              ) : block?.icon?.file ? (
                <NotionSecureImage
                  src={
                    awsImageObjectUrlToNotionUrl({
                      blockId: block.id,
                      s3ObjectUrl: block?.icon.file?.url
                    }) ?? ''
                  }
                  blockId={block.id}
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
            <div className='overflow-hidden max-h-[3.3em] [&>div>p]:line-clamp-2 [&>div>a]:line-clamp-2 [&>div>span]:line-clamp-2'>
              {block?.properties?.title?.title && (
                <NotionParagraphBlock
                  blockId={block.id}
                  richText={block?.properties?.title?.title}
                />
              )}
            </div>
            <div className='whitespace-nowrap'>
              <p>
                {date}
                {sortKey === 'last_edited_time' && ' 수정됨'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}, isEqual);

ChildDatabaseItem.displayName = 'ChildDatabaseItem';
