'use client';

import Link from 'next/link';
import { HiMenu } from 'react-icons/hi';
import type { GetNotionBlock } from '@/types/notion';
import { useNotionStore } from '@/store/notion';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';
import { siteConfig } from '@/lib/site-config';
import { Button } from '@/components/ui/button';
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
    <div className='mt-10 py-10 bg-card/60 text-base'>
      <div className='max-w-article mx-auto px-2'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div>
            {haveNext && (
              <Link
                className='flex items-center gap-x-4 py-2 px-4 text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-md shadow-md '
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
                  <div className='text-foreground font-bold'>{blogArticleRelation.next?.title}</div>
                </div>
              </Link>
            )}
          </div>
          <div>
            {havePrev && (
              <Link
                className='flex items-center gap-x-4 py-2 px-4 text-foreground bg-foreground/5 hover:bg-foreground/10 rounded-md shadow-md '
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
                  <div className='text-foreground font-bold'>{blogArticleRelation.prev?.title}</div>
                </div>
                <GrLinkNext className='shrink-0 text-[1.3em] [&>path]:stroke-current' />
              </Link>
            )}
          </div>
        </div>
        <div className='flex justify-between mt-3 [&>a]:normal-case'>
          {/* <Link
          className='btn btn-sm text-foreground shadow-md bg-foreground/5 hover:bg-foreground/10 border-0'
          href={parentIsBaseDatabase ? '/' : `/${parentDatabaseId}`}
        >
          <HiHome /> Home
        </Link> */}
          <Link
            className='ml-auto'
            href={
              parentDatabaseId === siteConfig.notion.baseBlock
                ? ARCHIVE_PATH
                : `/${parentDatabaseId}`
            }
          >
            <Button className='bg-foreground/5 hover:bg-foreground/10' variant='ghost'>
              <HiMenu /> View Archive
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
