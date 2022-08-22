import classnames from 'classnames';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import config from 'site-config';
import Link from 'next/link';
import NoSsrWrapper from 'src/lib/NoSsrWrapper';
import type { INotionSearchObject, Color } from 'src/types/notion';
import {
  notionColorClasses,
  NotionCopyHeadingLink,
  NotionHeadingInner,
  NotionParagraphText,
  NotionSecureImage
} from '.';
import { ko as koLocale } from 'date-fns/locale';

export interface NotionPageHeaderProps {
  page: INotionSearchObject;
  title: string | null;
}

const NotionPageHeader: React.FC<NotionPageHeaderProps> = ({ page, title }) => {
  return (
    <div>
      {page?.cover?.[page?.cover?.type]?.url && (
        <div className='relative h-[30vh] overflow-hidden [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full'>
          <NotionSecureImage
            blockId={page.id}
            src={page?.cover?.[page?.cover?.type]?.url!}
            layout='fill'
            objectFit='cover'
          />
        </div>
      )}
      <div
        className={classnames(
          'relative max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-10',
          Boolean(page?.cover)
            ? page.icon?.type === 'emoji'
              ? 'mt-[-30px]'
              : page.icon?.type === 'file'
              ? 'mt-[-36px]'
              : ''
            : 'mt-[50px]',
          !Boolean(page?.cover) && page.icon?.type === 'file' && 'pt-[50px]'
        )}
      >
        {page.icon?.file && page.icon?.type === 'file' && (
          <div className='w-[70px] h-[70px]'>
            <NotionSecureImage blockId={page.id} src={page.icon.file.url} />
          </div>
        )}
        {page.icon?.emoji && page.icon?.type === 'emoji' && (
          <span className='px-3 text-7xl font-emoji'>{page.icon?.emoji}</span>
        )}
        <div
          className={classnames(
            Boolean(page?.cover) && ['emoji', 'file'].includes(page.icon?.type)
              ? 'mt-[20px]'
              : 'mt-[50px]',
            'mb-3 text-[40px] font-bold'
          )}
        >
          <NotionHeadingInner type={'normal'}>
            <NotionParagraphText>{title || '제목 없음'}</NotionParagraphText>
            <NotionCopyHeadingLink
              href={title ? `/${title}-${page.id.replaceAll('-', '')}` : `/${page.id}`}
            >
              <Link href={title ? `/${title}-${page.id.replaceAll('-', '')}` : `/${page.id}`}>
                <a>&nbsp;🔗</a>
              </Link>
            </NotionCopyHeadingLink>
          </NotionHeadingInner>
        </div>
        <p className='text-opacity-50 text-base-content'>
          {typeof page?.created_time === 'string' &&
            `작성일: ${formatInTimeZone(
              new Date(page.created_time),
              config.TZ,
              'yyyy-MM-dd aaa hh:mm',
              {
                locale: koLocale
              }
            )}`}
          {typeof page?.last_edited_time === 'string' ? (
            <NoSsrWrapper>
              {`, ${formatDistance(
                utcToZonedTime(new Date(page.last_edited_time), config.TZ),
                utcToZonedTime(new Date(), config.TZ),
                {
                  locale: koLocale,
                  addSuffix: true
                }
              )} 수정됨`}
            </NoSsrWrapper>
          ) : null}
        </p>
        {Array.isArray(page.properties?.tags?.multi_select) && (
          <div className='flex gap-x-2'>
            {page.properties?.tags?.multi_select?.map((select) => {
              const color = (select?.color + '_background') as Color;

              return (
                <div
                  className={`${notionColorClasses[color]} bord px-1.5 rounded-md`}
                  color={select.color}
                  key={`multi-select-${page.id}-${select.id}`}
                >
                  <p>{select.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotionPageHeader;
