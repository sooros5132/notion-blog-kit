import type React from 'react';
import classnames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import config from 'site-config';
import { INotionSearchObject, INotionUserInfo, FileObject } from 'src/types/notion';
import { NotionParagraphText, NotionSecureImage } from '.';
import { enUS } from 'date-fns/locale';
import { notionTagColorClasses, Paragraph } from './Paragraph';
import classNames from 'classnames';
import { Fragment } from 'react';

export interface NotionPageHeaderProps {
  page: INotionSearchObject;
  title: string | null;
  userInfo?: INotionUserInfo | null;
}

export const NotionPageHeader: React.FC<NotionPageHeaderProps> = ({ page, title, userInfo }) => {
  const tags = page?.properties?.tags?.multi_select;
  const date = page?.properties?.publishedAt?.date?.start;

  return (
    <div>
      {page?.cover?.[page?.cover?.type]?.url && (
        <div className='relative h-[25vh] shadow-lg overflow-hidden pointer-events-none [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full md:h-[30vh] lg:shadow-xl'>
          <NotionSecureImage
            blockId={page.id}
            blockType={page.object}
            useType={'cover'}
            initialFileObject={page?.cover}
            alt={'page-cover'}
            loading='eager'
          />
        </div>
      )}
      <div
        className={classnames(
          'relative max-w-[var(--article-max-width)] mx-auto px-4 text-center sm:px-6 lg:px-10',
          page?.cover ? (page.icon ? 'mt-[-50px]' : '') : 'mt-[50px]',
          !page?.cover && page.icon && 'pt-[20px]'
        )}
      >
        {page.icon?.type && page.icon?.type !== 'emoji' && (
          <div className='w-[100px] h-[100px] mx-auto rounded-md overflow-hidden [&>div]:h-full'>
            <NotionSecureImage
              blockId={page.id}
              blockType={page.object}
              useType={'icon'}
              initialFileObject={page?.icon as FileObject}
              alt={'page-icon'}
              loading='eager'
            />
          </div>
        )}
        {page.icon?.emoji && page.icon?.type === 'emoji' && (
          <div className='text-center'>
            <span className='px-3 text-[100px] leading-none font-emoji'>{page.icon.emoji}</span>
          </div>
        )}
        <div
          className={classnames(
            'mb-3 text-[40px] font-bold break-all',
            Boolean(page?.cover) && Boolean(page.icon) ? 'mt-[20px]' : 'mt-[20px]'
          )}
        >
          <NotionParagraphText>{title || '제목 없음'}</NotionParagraphText>
        </div>
        {page.description && (
          <div className='mb-2 text-zinc-500'>
            <Paragraph richText={page.description} blockId={page.id} />
          </div>
        )}
        {page?.object !== 'database' && (
          <div className='text-zinc-500 leading-5'>
            {userInfo?.avatar_url ? (
              <div className='avatar leading-none align-bottom'>
                <div className='w-[1.2em] h-[1.2em] rounded-full'>
                  <img src={userInfo?.avatar_url} alt={`${userInfo?.name || 'author'}-avatar`} />
                </div>
              </div>
            ) : userInfo?.name ? (
              <div className='avatar placeholder'>
                <div className='bg-neutral-focus text-neutral-content rounded-full w-24'>
                  <span className='text-3xl'>{userInfo.name.slice(0, 1)}</span>
                </div>
              </div>
            ) : null}
            {userInfo?.name && <span className='ml-0.5'>{userInfo?.name}</span>}
            <span>{(date || typeof page?.created_time === 'string') && ' | '}</span>
            <span>
              {(date || typeof page?.created_time === 'string') &&
                `${formatInTimeZone(new Date(date || page.created_time), config.TZ, 'yyyy-MM-dd', {
                  locale: enUS
                })}`}
            </span>
            <span>{Boolean(tags?.length) && ' | '}</span>
            {Array.isArray(tags) && (
              <span className='text-sm'>
                {tags.map((tag, idx) => (
                  <Fragment key={tag.id}>
                    <span
                      className={classNames(
                        'px-1.5 rounded-md',
                        notionTagColorClasses[tag.color],
                        notionTagColorClasses[
                          (tag.color + '_background') as keyof typeof notionTagColorClasses
                        ]
                      )}
                    >
                      {tag.name}
                    </span>
                    {tags?.length !== idx && ' '}
                  </Fragment>
                ))}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
