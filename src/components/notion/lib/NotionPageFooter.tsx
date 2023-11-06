'use client';

import Link from 'next/link';
import { HiMenu } from 'react-icons/hi';
import type { GetNotionBlock } from '@/types/notion';
import { useNotionStore } from '@/store/notion';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import { siteConfig } from '@/lib/site-config';
import { ARCHIVE_PATH } from '@/lib/constants';

export function NotionPageFooter({ pageInfo }: { pageInfo: GetNotionBlock['pageInfo'] }) {
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
    <div className='text-base px-2'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          {haveNext && (
            <Link
              className='flex items-center gap-x-4 py-2 px-4 rounded-md shadow-md bg-foreground/5 transition-colors hover:bg-foreground/10'
              href={`/${
                blogArticleRelation.next?.slug ||
                blogArticleRelation.next?.title ||
                blogArticleRelation.next?.id
              }`}
            >
              <GrLinkPrevious className='shrink-0 text-[1.3em] [&>path]:stroke-current' />
              <div>
                <div className='text-xs select-none text-foreground/70'>
                  {blogArticleRelation.next?.category?.select?.name}
                </div>
                <div className='font-bold'>{blogArticleRelation.next?.title}</div>
              </div>
            </Link>
          )}
        </div>
        <div>
          {havePrev && (
            <Link
              className='flex items-center gap-x-4 py-2 px-4 rounded-md shadow-md bg-foreground/5 transition-colors hover:bg-foreground/10'
              href={`/${
                blogArticleRelation.prev?.slug ||
                blogArticleRelation.prev?.title ||
                blogArticleRelation.prev?.id
              }`}
            >
              <div className='grow text-right'>
                <div className='text-xs select-none text-foreground/70'>
                  {blogArticleRelation.prev?.category?.select?.name}
                </div>
                <div className='font-bold'>{blogArticleRelation.prev?.title}</div>
              </div>
              <GrLinkNext className='shrink-0 text-[1.3em] [&>path]:stroke-current' />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotionPageFooterViewArchive({
  pageInfo
}: {
  pageInfo: GetNotionBlock['pageInfo'];
}) {
  const parentDatabaseId = pageInfo?.parent.database_id?.replaceAll('-', '') || '';

  if (!parentDatabaseId) {
    return <></>;
  }
  return (
    <div className='text-right text-sm px-2'>
      <Link
        className='inline-flex px-4 py-2 items-center rounded-md shadow-md bg-foreground/5 transition-colors hover:bg-foreground/10'
        href={
          parentDatabaseId === siteConfig.notion.baseBlock ? ARCHIVE_PATH : `/${parentDatabaseId}`
        }
      >
        <HiMenu /> View Archive
      </Link>
    </div>
  );
}
