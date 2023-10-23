import { zonedTimeToUtc } from 'date-fns-tz';
import { FileObject, GetNotionBlock, NotionUser } from '@/types/notion';
import { NotionParagraphText, NotionSecureImage } from '.';
import Image from 'next/image';
import { BsDot } from 'react-icons/bs';
import { notionTagColorClasses } from '@/lib/notion';
import { Paragraph } from './Paragraph';
import { OptionalNextLink } from '@/components/modules/OptionalNextLink';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { CATEGORY_PATH, TAG_PATH } from '@/lib/constants';
import { DateTimeFormat } from '@/components/modules/DateTimeFormat';

export interface NotionPageHeaderProps {
  pageInfo: GetNotionBlock['pageInfo'];
  title: string | null;
  userInfo?: NotionUser | null;
}

export const NotionPageHeader: React.FC<NotionPageHeaderProps> = ({
  pageInfo,
  title,
  userInfo
}) => {
  const tags = pageInfo?.properties?.tags?.multi_select;
  const _publishedAt = pageInfo?.properties?.publishedAt?.date?.start || pageInfo.created_time;
  const category =
    (pageInfo.object === 'page' && pageInfo?.properties.category?.select?.name) || null;
  const parentIsBaseDatabase = Boolean(
    pageInfo.parent.database_id &&
      siteConfig.notion.baseBlock === pageInfo.parent.database_id.replaceAll('-', '')
  );

  const publishedAt = _publishedAt ? zonedTimeToUtc(new Date(_publishedAt), siteConfig.TZ) : null;

  return (
    <div>
      {pageInfo?.cover?.[pageInfo?.cover?.type]?.url && (
        <div className='relative h-[20vh] min-h-[250px] shadow-lg overflow-hidden pointer-events-none [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full md:h-[23vh] lg:shadow-xl'>
          <NotionSecureImage
            useNextImage
            blockId={pageInfo.id}
            blockType={pageInfo.object}
            useType={'cover'}
            initialFileObject={pageInfo?.cover}
            alt={'page-cover'}
            loading='eager'
          />
        </div>
      )}
      <div
        className={cn(
          'relative max-w-article mx-auto px-4 text-center sm:px-6 lg:px-10',
          pageInfo?.cover ? (pageInfo.icon ? 'mt-[-50px]' : '') : 'mt-[50px]',
          !pageInfo?.cover && pageInfo.icon && 'pt-[20px]'
        )}
      >
        {pageInfo.icon?.type && pageInfo.icon?.type !== 'emoji' && (
          <div className='w-[100px] h-[100px] mx-auto rounded-md overflow-hidden [&>div]:h-full'>
            <NotionSecureImage
              useNextImage
              blockId={pageInfo.id}
              blockType={pageInfo.object}
              useType={'icon'}
              initialFileObject={pageInfo?.icon as FileObject}
              alt={'page-icon'}
              loading='eager'
              sizes={{
                width: 100,
                height: 100
              }}
            />
          </div>
        )}
        {pageInfo.icon?.emoji && pageInfo.icon?.type === 'emoji' && (
          <div className='text-center'>
            <span className='px-3 text-[100px] leading-none font-emoji'>{pageInfo.icon.emoji}</span>
          </div>
        )}
        <div
          className={Boolean(pageInfo?.cover) && Boolean(pageInfo.icon) ? 'mt-[20px]' : 'mt-[20px]'}
        >
          {category && (
            <OptionalNextLink
              wrappingAnchor={parentIsBaseDatabase}
              href={`${CATEGORY_PATH}/${category}`}
              prefetch={false}
            >
              <span className={cn('text-zinc-500', parentIsBaseDatabase && 'hover:underline')}>
                {category}
              </span>
            </OptionalNextLink>
          )}
          <div className='mb-3 text-[40px] font-bold'>
            <NotionParagraphText>{title || 'Untitled'}</NotionParagraphText>
          </div>
        </div>
        {pageInfo.object === 'database' && (
          <div className='mb-2 text-zinc-500'>
            <Paragraph richText={pageInfo.description} blockId={pageInfo.id} />
          </div>
        )}
        {pageInfo?.object !== 'database' && (
          <div className='text-zinc-500'>
            {userInfo?.avatar_url ? (
              <Image
                className='inline align-text-bottom w-[1.2em] h-[1.2em] rounded-full overflow-hidden'
                src={userInfo?.avatar_url}
                alt={`${userInfo?.name || 'author'}-avatar`}
                width={24}
                height={24}
              />
            ) : userInfo?.name ? (
              <div className='avatar placeholder'>
                <div className='bg-neutral-focus text-neutral-content rounded-full w-24'>
                  <span className='text-3xl'>{userInfo.name.slice(0, 1)}</span>
                </div>
              </div>
            ) : null}
            {userInfo?.name && <span className='ml-0.5'>{userInfo?.name}</span>}
            {publishedAt && <BsDot className='inline' />}
            {publishedAt && (
              <span className='group text-zinc-500'>
                <span className='inline group-hover:hidden'>
                  <DateTimeFormat date={publishedAt} relativeTime={{ now: true }} />
                </span>
                <span className='hidden group-hover:inline'>
                  <DateTimeFormat date={publishedAt} />
                </span>
              </span>
            )}
            {Array.isArray(tags) && Boolean(tags.length) && <BsDot className='inline' />}
            {Array.isArray(tags) && (
              <span className='text-sm'>
                {tags.map((tag, idx) => (
                  <OptionalNextLink
                    key={tag.id}
                    wrappingAnchor={parentIsBaseDatabase}
                    href={`${TAG_PATH}/${tag.name}`}
                    prefetch={false}
                  >
                    <>
                      <span
                        className={cn(
                          'px-1.5 rounded-md hover:brightness-110',
                          notionTagColorClasses[tag.color],
                          notionTagColorClasses[
                            (tag.color + '_background') as keyof typeof notionTagColorClasses
                          ]
                        )}
                      >
                        {tag.name}
                      </span>
                      {tags?.length !== idx && ' '}
                    </>
                  </OptionalNextLink>
                ))}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
