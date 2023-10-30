'use client';

import type {
  FileObject,
  NotionDatabaseBlocks,
  NotionDatabasesRetrieve,
  NotionPagesRetrieve
} from '@/types/notion';
import { SiNotion } from 'react-icons/si';
import Link from 'next/link';
import { richTextToPlainText } from './utils';
import { NotionSecureImage } from '.';
import { siteConfig } from '@/lib/site-config';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ARCHIVE_PATH } from '@/lib/constants';
import { DateTimeFormat } from '@/components/modules/DateTimeFormat';
import { zonedTimeToUtc } from 'date-fns-tz';
import { HiOutlineLibrary } from 'react-icons/hi';

type NotionMagazineViewProps = {
  databaseInfo: NotionDatabasesRetrieve;
  notionBlock: NotionDatabaseBlocks;
};

export const NotionMagazineView: React.FC<NotionMagazineViewProps> = ({
  databaseInfo,
  notionBlock
}) => {
  const posts = notionBlock.results;

  const haveTitleProperty = Boolean(databaseInfo.properties.title?.title);

  return (
    <div>
      {/* <div className='flex h-[1.5em] my-2 itmes-center text-base justify-center'>
        {databaseInfo.properties.category?.select?.options?.map((option, i) => (
          <Fragment key={option.id}>
            <div className='px-1'>{option.name}</div>
            {i + 1 !== databaseInfo.properties.category?.select?.options.length && (
              <Separator orientation='vertical' />
            )}
          </Fragment>
        ))}
      </div> */}
      {haveTitleProperty &&
        (posts.length ? (
          <div className='grid grid-cols-6 gap-y-14 gap-x-12 px-4 sm:px-0 [&>a:nth-child(n+2)_.cover-image]:h-auto [&>a_.cover-image]:aspect-video [&>a:nth-child(1)]:col-span-6 [&>a:nth-child(n+2):nth-child(-n+5)]:col-span-6 sm:[&>a:nth-child(n+2):nth-child(-n+5)]:col-span-3 [&>a:nth-child(n+6)]:col-span-6 sm:[&>a:nth-child(n+6)]:col-span-3 md:[&>a:nth-child(n+6)]:col-span-2 sm:[&>a:nth-child(1)>div]:flex sm:[&>a:nth-child(1)>div]:flex-row [&>a:nth-child(1)_.cover-image]:basis-7/12 sm:[&>a:nth-child(1)_.post-info]:py-6 sm:[&>a:nth-child(1)]:h-[300px] sm:[&>a:nth-child(1)]:text-2xl sm:[&>a:nth-child(1)_.post-title]:line-clamp-6 md:[&>a:nth-child(1)]:text-3xl md:[&>a:nth-child(1)_.post-title]:line-clamp-5'>
            {posts.map((post, i) => (
              <PostSummary key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className='text-xl text-center opacity-70'>Not Found Posts.</div>
        ))}
      <div className='mt-12 mb-6 text-center'>
        <Link href={ARCHIVE_PATH}>
          <Button variant='outline' size='lg' className='rounded-full gap-x-2'>
            <HiOutlineLibrary /> View Archive
          </Button>
        </Link>
      </div>
    </div>
  );
};

type PostSummaryProps = {
  post: NotionPagesRetrieve;
};

const PostSummary: React.FC<PostSummaryProps> = ({ post }) => {
  const { id, properties, icon, cover } = post;
  const { category: categoryProperty } = properties;

  const category = categoryProperty?.select ? categoryProperty.select.name : null;
  const title = richTextToPlainText(properties?.title?.title);
  const slug = richTextToPlainText(properties?.slug?.rich_text);

  const parentDatabaseId = post?.parent?.database_id?.replaceAll('-', '');

  const href =
    parentDatabaseId === siteConfig.notion.baseBlock
      ? `/${slug}`
      : `/${id.replaceAll('-', '')}/${slug || 'Untitled'}`;

  const _publishedAt = properties?.publishedAt?.date?.start;
  const publishedAt = _publishedAt ? zonedTimeToUtc(new Date(_publishedAt), siteConfig.TZ) : null;
  return (
    <Link
      href={href}
      prefetch={false}
      className='shrink grow [&_.cover-image]:hover:brightness-110 [&_.cover-image>div]:transition-transform [&_.cover-image>div]:duration-700 [&_.cover-image>div]:hover:scale-105'
    >
      <Card className='h-full w-full bg-transparent shadow-none border-0 rounded-none isolate overflow-hidden'>
        <div className='cover-image flex items-center shrink-0 bg-foreground/5 brightness-95 transition-[filter] duration-700 ease-linear rounded-xl overflow-hidden [&>div]:w-full [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full'>
          {cover ? (
            <NotionSecureImage
              useNextImage
              blockId={id}
              blockType={post.object}
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
                blockType={post.object}
                useType={'icon'}
                initialFileObject={icon as FileObject}
                alt={'page-icon'}
              />
            ) : (
              <div className='notion-database-item-empty-cover w-full h-full text-foreground/5'>
                <SiNotion />
              </div>
            )
          ) : (
            <div className='notion-database-item-empty-cover w-full h-full text-foreground/5'>
              <SiNotion />
            </div>
          )}
        </div>
        <div className='post-info flex flex-col flex-auto justify-between p-4 py-3 gap-y-0.5 overflow-hidden sm:py-2'>
          {category && (
            <span className='shrink-0 text-xs text-zinc-500 line-clamp-1'>{category}</span>
          )}
          <div className='grow overflow-hidden'>
            <div className='post-title font-semibold line-clamp-3'>{title}</div>
          </div>
          {publishedAt && (
            <div className='flex-auto grow-0 shrink-0 text-right text-sm text-zinc-500'>
              <span className='group text-zinc-500'>
                <span className='inline group-hover:hidden'>
                  <DateTimeFormat date={publishedAt} relativeTime={{ now: true }} />
                </span>
                <span className='hidden group-hover:inline'>
                  <DateTimeFormat date={publishedAt} />
                </span>
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
