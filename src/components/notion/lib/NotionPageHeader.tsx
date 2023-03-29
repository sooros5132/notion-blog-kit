import type React from 'react';
import classnames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import config from 'site-config';
import {
  INotionSearchObject,
  URL_PAGE_TITLE_MAX_LENGTH,
  INotionUserInfo,
  FileObject
} from 'src/types/notion';
import {
  NotionCopyHeadingLink,
  NotionHeadingInner,
  NotionParagraphText,
  NotionSecureImage
} from '.';
import { ko as koLocale } from 'date-fns/locale';

export interface NotionPageHeaderProps {
  page: INotionSearchObject;
  title: string | null;
  userInfo?: INotionUserInfo | null;
}

const NotionPageHeader: React.FC<NotionPageHeaderProps> = ({ page, title, userInfo }) => {
  return (
    <div>
      {page?.cover?.[page?.cover?.type]?.url && (
        <div className='relative h-[25vh] shadow-lg overflow-hidden pointer-events-none [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full md:h-[30vh] lg:shadow-xl'>
          <NotionSecureImage
            blockId={page.id}
            blockType={'page'}
            useType={'cover'}
            initialFileObject={page?.cover}
            alt={'page-cover'}
            loading='eager'
          />
        </div>
      )}
      <div
        className={classnames(
          'relative max-w-[var(--article-max-width)] mx-auto px-4 sm:px-6 lg:px-10',
          page?.cover
            ? page.icon?.type === 'emoji'
              ? 'mt-[-50px]'
              : page.icon?.type === 'file'
              ? 'mt-[-50px]'
              : ''
            : 'mt-[50px]',
          !page?.cover && page.icon?.type === 'file' && 'pt-[20px]'
        )}
      >
        {page.icon?.file && page.icon?.type === 'file' && (
          <div className='w-[100px] h-[100px] rounded-md overflow-hidden'>
            <NotionSecureImage
              blockId={page.id}
              blockType={'page'}
              useType={'icon'}
              initialFileObject={page?.icon as FileObject}
              alt={'page-icon'}
              loading='eager'
            />
          </div>
        )}
        {page.icon?.emoji && page.icon?.type === 'emoji' && (
          <span className='px-3 text-[100px] leading-none font-emoji'>{page.icon?.emoji}</span>
        )}
        <div
          className={classnames(
            Boolean(page?.cover) && ['emoji', 'file'].includes(page.icon?.type)
              ? 'mt-[20px]'
              : 'mt-[20px]',
            'mb-3 text-[40px] font-bold'
          )}
        >
          <NotionHeadingInner type={'normal'}>
            <NotionParagraphText>{title || '제목 없음'}</NotionParagraphText>
            <NotionCopyHeadingLink
              href={
                title
                  ? `/${encodeURIComponent(
                      title.slice(0, URL_PAGE_TITLE_MAX_LENGTH)
                    )}-${page.id.replaceAll('-', '')}`
                  : `/${page.id}`
              }
            >
              <span className='cursor-pointer'>&nbsp;🔗</span>
            </NotionCopyHeadingLink>
          </NotionHeadingInner>
        </div>
        {page?.object !== 'database' && (
          <div className='text-zinc-500 leading-none'>
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
            <span>
              {typeof page?.created_time === 'string' &&
                ` | ${formatInTimeZone(new Date(page.created_time), config.TZ, 'yyyy-MM-dd', {
                  locale: koLocale
                })}`}
            </span>

            {Array.isArray(page?.properties?.tags?.multi_select) && (
              <span>
                {Boolean(page?.properties?.tags?.multi_select?.length) && ' | '}
                {page?.properties?.tags?.multi_select?.map((select) => {
                  // const color = select?.color as Color;

                  return (
                    <span
                      key={`${page.id}-${select.id}`}
                      // className={classnames(notionColorClasses[color], 'opacity-60')}
                    >
                      {`#${select.name} `}
                    </span>
                  );
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotionPageHeader;
