import {
  NotionBlock,
  IGetNotion,
  RichText,
  Color,
  INotionSearchObject,
  NotionDatabasesQuery
} from 'src/types/notion';
import useSWR from 'swr';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import config from 'site-setting';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { ko as koLocale } from 'date-fns/locale';
import NoSsrWrapper from '../../lib/NoSsrWrapper';
import classnames from 'classnames';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { CopyHeadingLink, HeadingInner } from './Heading';
import NotionSecureImage from './NotionSecureImage';
import { ParagraphText, notionColorClasses } from './Paragraph';
import { NotionBlocksRender, NotionChildDatabaseBlock } from '.';

export interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
  readonly slug: string;
}

// export const EllipsisWrapperBox = styled('div')({
//   overflow: 'hidden',
//   whiteSpace: 'nowrap',
//   maxHeight: '3.1em',
//   textOverflow: 'ellipsis',
//   '& p, a, span': {
//     display: '-webkit-box',
//     whiteSpace: 'normal',
//     WebkitBoxOrient: 'vertical',
//     WebkitLineClamp: '2'
//   }
// });

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<IGetNotion>('/notion/blocks/children/list/' + slug);
  const { data: page } = useSWR<INotionSearchObject>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocks?.results || !page) {
    return (
      <div className='flex-center'>
        <progress className='radial-progress'></progress>
      </div>
    );
  }

  const title =
    page.object === 'page'
      ? page.properties.title?.title?.map((text) => text?.plain_text).join('') || null
      : page.object === 'database'
      ? page.title?.map((text) => text?.plain_text).join('') || null
      : null;
  const description = blocks?.blocks?.results
    ?.slice(0, 10)
    ?.map((block: any) =>
      block?.[block.type]?.rich_text?.map((text: RichText) => text?.plain_text || '')?.join('')
    )
    ?.join(' ')
    .replace(/\n/gm, '');

  const url = page?.cover
    ? page?.cover?.type === 'external'
      ? page.cover.external?.url ?? ''
      : page?.cover?.type === 'file'
      ? awsImageObjectUrlToNotionUrl({
          blockId: page.id,
          s3ObjectUrl: page.cover.file?.url || ''
        })
      : ''
    : '';

  return (
    <div className='w-full mb-5 whitespace-pre-wrap'>
      <NextSeo
        title={title?.slice(0, 60) || '제목 없음'}
        description={description?.slice(0, 155) || undefined}
        openGraph={{
          url:
            config.origin + slug?.charAt(0) === '/'
              ? config.origin + slug
              : config.origin + '/' + slug,
          images: url
            ? [
                {
                  url: url
                }
              ]
            : undefined
        }}
      />
      <Head>
        {page.icon?.file && page.icon?.type === 'file' && (
          <link
            rel='shortcut icon'
            href={awsImageObjectUrlToNotionUrl({
              blockId: page.id,
              s3ObjectUrl: page.icon.file.url
            })}
          />
        )}
        {page.icon?.emoji && page.icon?.type === 'emoji' && (
          <link
            rel='shortcut icon'
            href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${page.icon?.emoji}</text></svg>`}
          />
        )}
      </Head>

      <div>
        {page?.cover?.[page?.cover?.type]?.url && (
          <div className='h-[30vh] overflow-hidden [&>div]:h-full [&>div>img]:w-full [&>div>img]:h-full'>
            <NotionSecureImage blockId={page.id} src={page?.cover?.[page?.cover?.type]?.url!} />
          </div>
        )}
        <div
          className={classnames(
            'max-w-screen-lg mx-auto',
            'px-4 sm:px-6 lg:px-10',
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
            <div className='relative w-[70px] h-[70px]'>
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
            <HeadingInner type={'normal'}>
              <ParagraphText>{title || '제목 없음'}</ParagraphText>
              <CopyHeadingLink href={title ? `/${title}-${page.id.slice(0, 8)}` : `/${page.id}`}>
                <Link href={title ? `/${title}-${page.id.slice(0, 8)}` : `/${page.id}`}>
                  <a>&nbsp;🔗</a>
                </Link>
              </CopyHeadingLink>
            </HeadingInner>
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
      <div className='max-w-screen-lg px-4 mx-auto mt-10 sm:px-6 lg:px-10 [&>*]:m-0.5'>
        {page.object === 'page' ? (
          <NotionBlocksRender blocks={blocks} />
        ) : page.object === 'database' ? (
          <NotionChildDatabaseBlock
            block={
              {
                ...page,
                child_database: {
                  title: title
                }
              } as unknown as NotionBlock
            }
            databases={{ [page.id]: blocks.blocks as unknown as NotionDatabasesQuery }}
          />
        ) : null}

        {page?.id && (
          <div className='flex justify-end pt-5'>
            {process.env.NODE_ENV === 'production' ? (
              <img
                src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent(
                  `${config.origin}/${page.id}`
                )}&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false`}
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                width='75'
                height='20'
              >
                <linearGradient id='smooth' x2='0' y2='100%'>
                  <stop offset='0' stopColor='#bbb' stopOpacity='.1' />
                  <stop offset='1' stopOpacity='.1' />
                </linearGradient>

                <mask id='round'>
                  <rect width='75' height='20' rx='3' ry='3' fill='#fff' />
                </mask>

                <g mask='url(#round)'>
                  <rect width='30' height='20' fill='#555555' />
                  <rect x='30' width='45' height='20' fill='#79C83D' />
                  <rect width='75' height='20' fill='url(#smooth)' />
                </g>

                <g
                  fill='#fff'
                  textAnchor='middle'
                  fontFamily='Verdana,DejaVu Sans,Geneva,sans-serif'
                  fontSize='11'
                >
                  <text x='16' y='15' fill='#010101' fillOpacity='.3'>
                    hits
                  </text>
                  <text x='16' y='14' fill='#fff'>
                    hits
                  </text>
                  <text x='51.5' y='15' fill='#010101' fillOpacity='.3'>
                    {' '}
                    1 / 1{' '}
                  </text>
                  <text x='51.5' y='14' fill='#fff'>
                    {' '}
                    1 / 1{' '}
                  </text>
                </g>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

NotionRender.displayName = 'NotionRender';

export default NotionRender;
