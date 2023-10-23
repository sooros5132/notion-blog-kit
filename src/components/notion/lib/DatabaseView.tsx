'use client';

import type {
  FileObject,
  NotionDatabaseBlocks,
  NotionDatabasesQuery,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve
} from '@/types/notion';
import { SiNotion } from 'react-icons/si';
import Link from 'next/link';
import { richTextToPlainText } from './utils';
import { notionTagColorClasses } from '@/lib/notion';
import { NotionSecureImage } from '.';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { zonedTimeToUtc } from 'date-fns-tz';
import { DateTimeFormat } from '@/components/modules/DateTimeFormat';
import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { POST_LIMIT } from '@/lib/constants';

type NotionDatabasePageViewProps = {
  databaseInfo: NotionDatabasesRetrieve;
  notionBlock: NotionDatabaseBlocks;
  filterType?: string;
  filterValue?: string;
};

export const NotionDatabasePageView: React.FC<NotionDatabasePageViewProps> = ({
  databaseInfo,
  notionBlock,
  filterType,
  filterValue
}) => {
  const havePublishedAt = databaseInfo?.properties?.publishedAt?.type === 'date';

  const { data, error, isValidating, size, setSize, mutate } = useSWRInfinite<NotionDatabasesQuery>(
    (pageIndex, prevData) => {
      if (!notionBlock?.has_more) return null;
      if (prevData && !prevData.next_cursor && !prevData.has_more) return null;

      if (pageIndex === 0)
        return `/api/v1/notion/databases/${
          databaseInfo.id
        }/posts?size=${POST_LIMIT}&havePublishedAt=${havePublishedAt}&filterType=${
          filterType || ''
        }&filterValue=${filterValue || ''}`;

      return `/api/v1/notion/databases/${databaseInfo.id}/posts?nextCursor=${
        prevData?.next_cursor
      }&size=${POST_LIMIT}&havePublishedAt=${havePublishedAt}&filterType=${
        filterType || ''
      }&filterValue=${filterValue || ''}`;
    },
    async (key) => {
      const { nextCursor, size, filterType, filterValue, havePublishedAt } = queryString.parse(
        key.split('?')[1]
      ) as {
        size: string;
        nextCursor: string;
        filterType: string;
        filterValue: string;
        havePublishedAt: string;
      };
      return await axios
        .get<NotionDatabasesQuery>(`/api/v1/notion/databases/${databaseInfo.id}/posts`, {
          params: {
            nextCursor,
            size,
            filterType,
            filterValue,
            havePublishedAt
          }
        })
        .then((res) => res.data);
    },
    {
      errorRetryCount: 1,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      fallbackData: [notionBlock]
    }
  );

  const hasMore = data ? data[data.length - 1]?.has_more : false;

  const handleClickMoreButton = () => {
    setSize(size + 1);
  };

  return (
    <div>
      <div className='flex flex-col px-1 sm:p-0 [&>div]:py-3 sm:[&>div]:py-6 [&>div]:border-b last:[&>div]:border-0'>
        {!data ? (
          notionBlock.results.map((post) => <PostSummary key={post.id} article={post} />)
        ) : data?.length ? (
          data?.map((database) =>
            database?.results?.map((post) => <PostSummary key={post.id} article={post} />)
          )
        ) : (
          <div className='my-10 text-xl text-center opacity-80'>Not Found Posts.</div>
        )}
      </div>
      {notionBlock?.results?.length ? (
        <div className='flex my-10 justify-center'>
          <Button
            variant='outline'
            className='mx-auto rounded-full'
            disabled={!hasMore || isValidating}
            onClick={handleClickMoreButton}
          >
            {isValidating && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
            {hasMore ? 'Load more' : 'All loaded'}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

type PostSummaryProps = {
  article: NotionPagesRetrieve;
};

const PostSummary: React.FC<PostSummaryProps> = ({ article }) => {
  const { id, properties, icon, cover, parent } = article;
  const { category: categoryProperty, tags, rank, thumbnail, updatedAt } = properties;
  const haveTagProperty = tags?.type === 'multi_select';

  const category = categoryProperty?.select ? categoryProperty.select.name : null;
  const title = richTextToPlainText(properties?.title?.title);
  const slug = richTextToPlainText(properties?.slug?.rich_text);

  const parentDatabaseId = article?.parent?.database_id?.replaceAll('-', '');

  const href =
    parentDatabaseId === siteConfig.notion.baseBlock
      ? `/${slug}`
      : `/${id.replaceAll('-', '')}/${slug || title || 'Untitled'}`;

  const _publishedAt = properties?.publishedAt?.date?.start || null;
  const publishedAt = _publishedAt ? zonedTimeToUtc(new Date(_publishedAt), siteConfig.TZ) : null;
  return (
    <div>
      <Link href={href} prefetch={false}>
        <div className='flex m-2 h-36 sm:h-40'>
          <div className='cover-image flex items-center shrink-0 rounded-xl bg-foreground/5 overflow-hidden [&>div]:w-full [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full w-[144px] sm:w-[200px] md:w-[250px]'>
            {cover ? (
              <NotionSecureImage
                useNextImage
                blockId={id}
                blockType={article.object}
                useType={'cover'}
                initialFileObject={cover}
                alt={'page-cover'}
              />
            ) : icon ? (
              icon?.emoji ? (
                <div className='notion-database-item-empty-cover'>{icon?.emoji}</div>
              ) : icon?.file ? (
                <NotionSecureImage
                  useNextImage
                  blockId={id}
                  blockType={article.object}
                  useType={'icon'}
                  initialFileObject={icon as FileObject}
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
          <div className='flex-auto shrink grow flex flex-col justify-between overflow-hidden p-4 py-3 sm:py-2'>
            {category && (
              <div className='flex shrink-0 overflow-hidden'>
                <span className='text-xs text-zinc-500 line-clamp-1'>{category}</span>
              </div>
            )}
            <div className='flex-auto grow my-1 mb-auto text-base sm:text-lg max-h-[2.9em] font-semibold line-clamp-2 sm:max-h-[4.4em] sm:line-clamp-3'>
              {title}
            </div>
            <div className='grow-0 shrink-0 text-sm'>
              {haveTagProperty && (
                <div className='line-clamp-1 space-x-1'>
                  {tags.multi_select?.map((tag, idx) => (
                    <span
                      key={tag.id}
                      className={cn(
                        'px-1.5 rounded-md text-opacity-80 bg-opacity-70',
                        notionTagColorClasses[tag.color],
                        notionTagColorClasses[
                          (tag.color + '_background') as keyof typeof notionTagColorClasses
                        ]
                      )}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
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
          </div>
        </div>
      </Link>
    </div>
  );
};
