import React, { useMemo, memo, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  NotionBlock,
  IGetNotion,
  RichText,
  Color,
  NotionDatabase,
  INotionSearchObject,
  NotionDatabasesQuery
} from 'src/types/notion';
import useSWR from 'swr';
import Link from 'next/link';
import { ImageProps } from 'next/image';
import { NextSeo } from 'next-seo';
import { useRef } from 'react';
import { useState } from 'react';
import { TiChevronRight } from 'react-icons/ti';
import Head from 'next/head';
import { BsArrowDownShort, BsArrowUpShort } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import isEqual from 'react-fast-compare';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { SiNotion } from 'react-icons/si';
import config from 'site-setting';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { ko as koLocale } from 'date-fns/locale';
import { copyTextAtClipBoard } from 'src/lib/utils';
import { useRouter } from 'next/router';
import NoSsrWrapper from './NoSsrWrapper';
import { fetcher } from 'src/lib/swr';
import { IoClose } from 'react-icons/io5';
import { sortBy } from 'lodash';
import classnames from 'classnames';

interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
  readonly slug: string;
}

interface ParagraphTextProps {
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'last' | 'middle';
  color?: Color;
  children?: React.ReactNode;
}

const paragraphTextConfig = {
  code: {
    once: 'rounded-l rounded-r py-0.5 px-1 bg-notionColor-red_background font-mono',
    first: 'rounded-l py-0.5 pl-1 bg-notionColor-red_background font-mono',
    last: 'rounded-r py-0.5 pr-1 bg-notionColor-red_background font-mono',
    middle: 'py-0.5 bg-notionColor-red_background font-mono'
  }
} as const;

const notionColor = {
  default: 'text-notionColor-default',
  gray: 'text-notionColor-gray',
  brown: 'text-notionColor-brown',
  orange: 'text-notionColor-orange',
  yellow: 'text-notionColor-yellow',
  green: 'text-notionColor-green',
  blue: 'text-notionColor-blue',
  purple: 'text-notionColor-purple',
  pink: 'text-notionColor-pink',
  red: 'text-notionColor-red',
  gray_background: 'bg-notionColor-gray_background',
  brown_background: 'bg-notionColor-brown_background',
  orange_background: 'bg-notionColor-orange_background',
  yellow_background: 'bg-notionColor-yellow_background',
  green_background: 'bg-notionColor-green_background',
  blue_background: 'bg-notionColor-blue_background',
  purple_background: 'bg-notionColor-purple_background',
  pink_background: 'bg-notionColor-pink_background',
  red_background: 'bg-notionColor-red_background'
};

const ParagraphText = ({
  bold,
  code,
  color,
  italic,
  strikethrough,
  underline,
  children
}: ParagraphTextProps) => {
  return (
    <span
      className={classnames(
        bold && 'font-bold',
        italic && 'italic',
        strikethrough && 'line-through',
        underline && 'underline',
        code && paragraphTextConfig.code[code],
        color && color !== 'default' && !color.match(/_background$/) && notionColor[color],
        color && color.match(/_background$/) && notionColor[color]
      )}
    >
      {children}
    </span>
  );
};

interface HeadingContainerProps {
  id: string;
  children: ReactNode;
}

const HeadingContainer = ({ id, children }: HeadingContainerProps) => {
  return (
    <div id={id} className='pt-[2.1em] mb-1'>
      {children}
    </div>
  );
};
interface HeadingProps {
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database' | 'normal';
  children: ReactNode;
}

const Heading = ({ type, children }: HeadingProps) => {
  return (
    <div
      className={classnames(
        'font-bold flex break-all leading-[1.2em]',
        type === 'heading_1' || type === 'child_database'
          ? 'text-[2em]'
          : type === 'heading_2'
          ? 'text-[1.5em]'
          : type === 'normal'
          ? undefined
          : 'text-[1.2em]',
        '[&>div>.heading-link]:hidden [&:hover>div>.heading-link]:block'
      )}
    >
      {children}
    </div>
  );
};

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

interface CalloutBlockContainerProps {
  color: Color;
  children: ReactNode;
}

const CalloutBlockContainer = ({ color, children }: CalloutBlockContainerProps) => {
  return (
    <div
      className={classnames(
        'py-1.5 px-3 pl-1.5 my-0.5',
        color && color !== 'default' && !color.match(/_background$/) && notionColor[color],
        color && color.match(/_background$/) && notionColor[color]
      )}
    >
      {children}
    </div>
  );
};

const Table = ({
  has_column_header,
  has_row_header,
  children
}: {
  has_column_header?: 'true' | 'false';
  has_row_header?: 'true' | 'false';
  children: ReactNode;
}) => {
  return (
    <table
      className={classnames(
        'border-collapse',
        '[&>tbody>tr>td]:border',
        '[&>tbody>tr>td]:border-solid',
        '[&>tbody>tr>td]:border-notionColor-green_background',
        '[&>tbody>tr>td]:py-0.5',
        '[&>tbody>tr>td]:px-1',
        has_row_header === 'true' &&
          '[&>tbody>tr>td:first-of-type]:bg-notionColor-green_background/20',
        has_column_header === 'true' &&
          '[&>tbody>tr:first-of-type]:bg-notionColor-green_background/20'
      )}
    >
      {children}
    </table>
  );
};

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
          url: config.origin + slug?.charAt(0) === '/' ? slug : '/' + slug,
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
          <div className='h-[30vh] overflow-hidden [&>div>img]:w-full'>
            <NotionSecureImage blockId={page.id} src={page?.cover?.[page?.cover?.type]?.url!} />
          </div>
        )}
        <div
          className={classnames(
            'max-w-screen-lg mx-auto',
            'px-4 sm:px-6 lg:px-10',
            Boolean(page?.cover)
              ? page.icon?.type === 'emoji'
                ? 'mt-[-50px]'
                : page.icon?.type === 'file'
                ? 'mt-[-34px]'
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
            <Heading type={'normal'}>
              <div>
                <CopyHeadingLink href={title ? `/${title}-${page.id.slice(0, 8)}` : `/${page.id}`}>
                  <Link href={title ? `/${title}-${page.id.slice(0, 8)}` : `/${page.id}`}>
                    <a>🔗</a>
                  </Link>
                </CopyHeadingLink>
              </div>
              <ParagraphText>{title || '제목 없음'}</ParagraphText>
            </Heading>
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
                    className={`${notionColor[color]} bord px-1.5 rounded-md`}
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
      <div className='max-w-screen-lg px-4 mx-auto sm:px-6 lg:px-10'>
        {page.object === 'page' ? (
          <NotionContentContainer blocks={blocks} />
        ) : page.object === 'database' ? (
          <ChildDatabase
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
      </div>
    </div>
  );
};

interface NotionContentContainerProps {
  blocks: IGetNotion;
}

const NotionContentContainer: React.FC<NotionContentContainerProps> = ({ blocks }) => {
  const numberOfSameTag = useRef(0);
  const childrenDepth = useRef(0);

  return (
    <div>
      {blocks.blocks?.results.map((block, i) => {
        numberOfSameTag.current =
          blocks.blocks.results?.[i - 1]?.type === block.type ? numberOfSameTag.current + 1 : 0;

        childrenDepth.current = block?.has_children ? childrenDepth.current + 1 : 0;

        switch (block.type) {
          case 'child_database': {
            return (
              <ChildDatabase
                block={block}
                databases={blocks.databaseBlocks}
                key={`block-${block.id}-${i}`}
              />
            );
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <HeadingBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'paragraph': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <Paragraph
                  blockId={block.id}
                  richText={block.paragraph.rich_text}
                  color={block.paragraph.color}
                />
              </NotionBlockRender>
            );
          }
          case 'bookmark': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='break-all min-h-[1.25em] p-0.5'>
                  <a
                    className='underline'
                    key={`block-${block.id}-${i}`}
                    href={notionBlockUrlToRelativePath(block.bookmark.url)}
                    rel='noreferrer'
                    target='_blank'
                  >
                    {block.bookmark.url}
                  </a>
                </div>
              </NotionBlockRender>
            );
          }
          case 'divider': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <hr className='border-gray-500' />
              </NotionBlockRender>
            );
          }
          case 'toggle': {
            // 토글은 안에서 BlockRender시킴.
            return (
              <Toggle
                key={`block-${block.id}-${i}`}
                blocks={blocks}
                block={block}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'numbered_list_item': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='flex'>
                  <div className='flex-initial py-0.5 basis-6 text-right'>
                    {numberOfSameTag.current + 1}.
                  </div>
                  <div className='flex-auto'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.numbered_list_item.rich_text}
                      color={block.numbered_list_item.color}
                    />
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'video': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <VideoBlock block={block} />
              </NotionBlockRender>
            );
          }
          case 'image': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='flex justify-center'>
                  <div>
                    <NotionSecureImage
                      blockId={block.id}
                      src={block.image?.file?.url ?? block.image?.external?.url ?? ''}
                    />
                    {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
                      <div className='w-full'>
                        <Paragraph
                          blockId={block.id}
                          richText={block.image.caption}
                          color={'gray'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'code': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <SyntaxHighlighter
                  language={block?.code?.language || undefined}
                  style={vscDarkPlus}
                  showLineNumbers
                  lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                >
                  {block?.code?.rich_text?.map((text) => text?.plain_text ?? '').join('')}
                </SyntaxHighlighter>
                {Array.isArray(block?.code?.caption) && block?.code?.caption?.length > 0 && (
                  <div className='w-full'>
                    <Paragraph blockId={block.id} richText={block.code.caption} color={'gray'} />
                  </div>
                )}
              </NotionBlockRender>
            );
          }
          case 'callout': {
            return (
              <CalloutBlock
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'quote': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='p-0.5 bg-notionColor-gray_background'>
                  <div className='bg-[rgb(46 46 46 / 8%)] py-1.5 px-3 border-l-[0.3125rem] border-solid border-base-content'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.quote.rich_text}
                      color={block.quote.color}
                    />
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'bulleted_list_item': {
            return (
              <NotionBlockRender
                key={`block-${block.id}-${i}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              >
                <div className='flex'>
                  <div className='flex items-center max-h-7 basis-6 text-sm flex-initial py-0.5'>
                    <GoPrimitiveDot />
                  </div>
                  <div className='flex-auto'>
                    <Paragraph
                      blockId={block.id}
                      richText={block.bulleted_list_item.rich_text}
                      color={block.bulleted_list_item.color}
                    />
                  </div>
                </div>
              </NotionBlockRender>
            );
          }
          case 'column_list': {
            return (
              <div
                className='grid gap-x-2 [&>*]:overflow-x-auto'
                style={{
                  gridTemplateColumns: `repeat(${
                    blocks['childrenBlocks'][block.id]?.results.length ?? 1
                  }, 1fr)`
                }}
                key={`block-${block.id}-${i}`}
              >
                {blocks['childrenBlocks'][block.id]?.results.map((block, i) => {
                  return (
                    <div className='mx-0.5' key={`block-${block.id}-${i}`}>
                      <NotionContentContainer
                        blocks={{
                          blocks: blocks['childrenBlocks'][block.id],
                          childrenBlocks: blocks.childrenBlocks,
                          databaseBlocks: blocks.databaseBlocks
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }
          case 'column': {
            return (
              <NotionBlockRender
                key={`block-${block.id}`}
                block={block}
                blocks={blocks}
                chilrenBlockDepth={childrenDepth.current}
              />
            );
          }
          case 'link_preview': {
            const href = block.link_preview.url;
            return (
              <a
                className='underline'
                key={`block-anchor-${block.id}-${i}`}
                href={notionBlockUrlToRelativePath(href)}
                rel='noreferrer'
                target='_blank'
              >
                <ParagraphText>{href}</ParagraphText>
              </a>
            );
          }
          case 'table': {
            return (
              <TableBlock block={block} blocks={blocks} chilrenBlockDepth={childrenDepth.current} />
            );
          }
        }

        return <React.Fragment key={`block-${block.id}-${i}`}></React.Fragment>;
      })}
    </div>
  );
};

interface TableBlockProps {
  block: NotionBlock;
  blocks: IGetNotion;
  chilrenBlockDepth?: number;
}

const TableBlock: React.FC<TableBlockProps> = ({ block, blocks, chilrenBlockDepth }) => {
  const tbodyBlock = blocks.childrenBlocks[block.id];

  if (!block?.table || !tbodyBlock) {
    return null;
  }

  return (
    <Table
      has_column_header={`${Boolean(block.table.has_column_header)}`}
      has_row_header={`${Boolean(block.table.has_row_header)}`}
    >
      {/* <thead>
        <tr>
          {[...new Array(block.table.table_width)].map((i) => (
            <th key={`table-head-th-${i}`}></th>
          ))}
        </tr>
      </thead> */}
      <tbody>
        {tbodyBlock.results.map((rowBlock, rowIdx) => (
          <tr key={`table-row-${rowBlock.id}`}>
            {rowBlock.table_row.cells.map((cellBlocks, cellIdx) => (
              <td key={`table-row-${rowBlock.id}-cell-${cellIdx}`}>
                <Paragraph blockId={rowBlock.id} richText={cellBlocks} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

interface CalloutBlockProps {
  block: NotionBlock;
  blocks: IGetNotion;
  chilrenBlockDepth?: number;
}

const CalloutBlock: React.FC<CalloutBlockProps> = ({ block, blocks, chilrenBlockDepth }) => {
  return (
    <CalloutBlockContainer color={block.callout.color}>
      <NotionBlockRender block={block} blocks={blocks} chilrenBlockDepth={chilrenBlockDepth}>
        <div className='flex'>
          <div className='pt-0.5 basis-6 flex justify-center'>
            <div className='text-xl leading-6 font-emoji'>
              {block.callout?.icon?.file && block.callout?.icon?.type === 'file' && (
                <NotionSecureImage blockId={block.id} src={block.callout?.icon.file.url} />
              )}
              {block.callout?.icon?.emoji &&
                block.callout?.icon?.type === 'emoji' &&
                block.callout?.icon?.emoji}
            </div>
          </div>
          <Paragraph blockId={block.id} richText={block.callout.rich_text} />
        </div>
      </NotionBlockRender>
    </CalloutBlockContainer>
  );
};

interface NotionBlockProps {
  block: NotionBlock;
  blocks: IGetNotion;
  children?: React.ReactNode;
  chilrenBlockDepth?: number;
}

const NotionBlockRender: React.FC<NotionBlockProps> = ({
  block,
  blocks,
  children,
  chilrenBlockDepth
}) => {
  return (
    <div className='mx-0.5'>
      {children}
      {block?.has_children && typeof chilrenBlockDepth === 'number' && chilrenBlockDepth > 0 && (
        <div className='ml-6'>
          <NotionContentContainer
            blocks={{
              blocks: blocks['childrenBlocks'][block.id],
              childrenBlocks: blocks.childrenBlocks,
              databaseBlocks: blocks.databaseBlocks
            }}
          />
        </div>
      )}
    </div>
  );
};

type NotionChildrenRenderProps = { block: NotionBlock };

const HeadingBlock: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  const router = useRouter();
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  const hash = `${block[type].rich_text
    .map((text) => text.plain_text)
    .join('')
    .slice(0, 50)}-${block.id.slice(0, 8)}`;
  const href = useMemo(() => `${router.asPath.replace(/\#.*/, '')}#${hash}`, [router]);
  return (
    <HeadingContainer id={hash}>
      <Heading type={type}>
        <div className='flex items-center'>
          <CopyHeadingLink href={href}>
            <a href={'#' + hash}>🔗</a>
          </CopyHeadingLink>
        </div>
        <Paragraph blockId={block.id} richText={block[type].rich_text} color={block[type].color} />
      </Heading>
    </HeadingContainer>
  );
};

const CopyHeadingLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => {
  const handleClick = (url: string) => () => {
    const href = new URL(url, config.origin).href;

    href && copyTextAtClipBoard(href);
  };
  return (
    <div className='mr-1 heading-link' onClick={handleClick(href)}>
      {children}
    </div>
  );
};

interface ParagraphProps {
  blockId: string;
  richText: Array<RichText>;
  color?: Color;
}

const Paragraph: React.FC<ParagraphProps> = ({ blockId, richText, color }) => {
  if (!Array.isArray(richText)) {
    return null;
  }

  return (
    <div
      className={classnames(
        'break-all',
        'min-h-[1.25em]',
        'p-0.5',
        color && color !== 'default' && !color.match(/_background$/) && notionColor[color],
        color && color.match(/_background$/) && notionColor[color]
      )}
    >
      {richText.map((text, i) => {
        if (text.type === 'mention') {
          return (
            <React.Fragment key={`block-mention-${blockId}-${i}`}></React.Fragment>
            // <ParagraphText key={`block-${block.id}-${block.type}-${text.type}-${i}`}>
            //   mention
            // </ParagraphText>
          );
        }

        const {
          type,
          plain_text,
          href,
          annotations: { bold, code, italic, strikethrough, underline, color }
        } = text;

        const prevTextIsCode = code && richText[i - 1]?.annotations.code;
        const nextTextIsCode = code && richText[i + 1]?.annotations.code;

        const annotations: Partial<ParagraphTextProps> = {
          bold: bold ? 'bold' : undefined,
          italic: italic ? 'italic' : undefined,
          strikethrough: strikethrough ? 'line-through' : undefined,
          underline: underline ? 'underline' : undefined,
          color: color ? color : undefined,
          code: code
            ? !prevTextIsCode && !nextTextIsCode
              ? 'once'
              : !prevTextIsCode && nextTextIsCode
              ? 'first'
              : nextTextIsCode
              ? 'middle'
              : 'last'
            : undefined
        };

        if (href) {
          return (
            <a
              className='underline'
              key={`block-anchor-${blockId}-${i}`}
              href={notionBlockUrlToRelativePath(href)}
              rel='noreferrer'
              target='_blank'
            >
              <ParagraphText {...annotations}>{plain_text}</ParagraphText>
            </a>
          );
        }
        return (
          <ParagraphText key={`block-${blockId}-${i}`} {...annotations}>
            {plain_text}
          </ParagraphText>
        );
      })}
    </div>
  );
};

interface ToggleProps {
  block: NotionBlock;
  blocks: IGetNotion;
  chilrenBlockDepth?: number;
}

const Toggle: React.FC<ToggleProps> = ({ block, blocks, chilrenBlockDepth }) => {
  const [isOpen, setOpen] = useState(false);
  const handleClickToggleButton = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className={notionColor[block.toggle.color]}>
      <NotionBlockRender
        block={block}
        blocks={blocks}
        chilrenBlockDepth={isOpen ? chilrenBlockDepth : undefined}
      >
        <div className='cursor-pointer'>
          <div className='flex items-center' onClick={handleClickToggleButton}>
            <div className={`${isOpen ? 'rotate-90' : ''}`}>
              <TiChevronRight />
            </div>
            <div className='flex-auto'>
              <Paragraph blockId={block.id} richText={block.toggle.rich_text} />
            </div>
          </div>
        </div>
      </NotionBlockRender>
    </div>
  );
};

interface ChildDatabaseProps extends NotionChildrenRenderProps {
  databases: IGetNotion['databaseBlocks'];
}

const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block, databases }) => {
  const router = useRouter();
  const [blocks, setBlocks] = useState(
    sortBy(
      databases[block.id]?.results?.[0]?.properties?.isPublished?.type === 'checkbox'
        ? databases[block.id]?.results
            .filter((b) => b.properties?.['isPublished']?.checkbox)
            .map((databaseBlock) => {
              const title =
                databaseBlock.properties?.title?.title?.map((title) => title.plain_text).join() ??
                '제목 없음';
              const newBlock = {
                ...databaseBlock,
                title
              };
              return newBlock;
            }) || []
        : databases[block.id]?.results || [],
      'created_time'
    ).reverse()
  );
  const [sortKey, setSortKey] = useState<'created_time' | 'last_edited_time' | 'title'>(
    'created_time'
  );
  const [isOrderAsc, setIsOrderAsc] = useState(true);
  const KorKeyRecord = useMemo<Record<typeof sortKey, string>>(
    () => ({
      created_time: '생성일',
      last_edited_time: '수정일',
      title: '이름'
    }),
    []
  );

  const handleCloseSortMenu = (prop?: typeof sortKey) => () => {
    switch (prop) {
      // 시간은 반대 개념 나머지는 정상
      case 'last_edited_time':
      case 'created_time': {
        if (prop === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc ? sortBy(prevBlocks, prop) : sortBy(prevBlocks, prop).reverse()
          );
          setSortKey(prop);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, prop));
          setSortKey(prop);
          setIsOrderAsc(true);
        }
      }
      case 'title': {
        if (prop === sortKey) {
          const newIsOrderAsc = !isOrderAsc;
          setBlocks((prevBlocks) =>
            newIsOrderAsc ? sortBy(prevBlocks, prop).reverse() : sortBy(prevBlocks, prop)
          );
          setSortKey(prop);
          setIsOrderAsc(newIsOrderAsc);
        } else {
          setBlocks((prevBlocks) => sortBy(prevBlocks, prop).reverse());
          setSortKey(prop);
          setIsOrderAsc(true);
        }
        break;
      }
    }
  };
  const hash = `${block?.child_database?.title.slice(0, 50) || ''}-${block.id.slice(0, 8)}`;
  const href = useMemo(() => `${router.asPath.replace(/\#.*/, '')}#${hash}`, [router]);

  return (
    <div>
      <HeadingContainer id={hash}>
        <Heading type={block.type as 'child_database'}>
          <div className='flex items-center'>
            <CopyHeadingLink href={href}>
              <a href={'#' + hash}>🔗</a>
            </CopyHeadingLink>
          </div>
          <div className='flex-auto'>
            <div className='flex items-center justify-between'>
              <p className='break-words break-all'>{block?.child_database?.title || '제목 없음'}</p>
              <div className='dropdown dropdown-left'>
                <label
                  tabIndex={0}
                  className='m-1 text-xl whitespace-nowrap flex-nowrap btn btn-ghost btn-sm text-inherit'
                >
                  {KorKeyRecord[sortKey]}
                  {isOrderAsc ? <BsArrowUpShort /> : <BsArrowDownShort />}
                </label>
                <ul
                  tabIndex={0}
                  className='p-2 text-xl shadow dropdown-content menu bg-base-300 rounded-box w-52'
                >
                  <li onClick={handleCloseSortMenu('title')}>
                    <a>이름</a>
                  </li>
                  <li onClick={handleCloseSortMenu('created_time')}>
                    <a>생성일</a>
                  </li>
                  <li onClick={handleCloseSortMenu('last_edited_time')}>
                    <a>수정일</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Heading>
      </HeadingContainer>
      <div className='grid grid-cols-1 gap-5 mb-5 sm:grid-cols-2 lg:grid-cols-3'>
        {blocks.map((block) => (
          <ChildDatabaseBlock key={`database-${block.id}`} block={block} />
        ))}
      </div>
    </div>
  );
};

const ChildDatabaseBlock: React.FC<{ block: NotionDatabase }> = memo(({ block }) => {
  const [createdAt, setCreatedAt] = useState(
    block?.created_time
      ? formatInTimeZone(new Date(block.created_time), config.TZ, 'yyyy-MM-dd', {
          locale: koLocale
        })
      : undefined
  );
  const title = useMemo(
    () => block?.properties?.title?.title?.map((t) => t?.plain_text).join('') || null,
    []
  );

  useEffect(() => {
    if (block?.created_time) {
      setCreatedAt(
        formatDistance(
          utcToZonedTime(new Date(block.created_time), config.TZ),
          utcToZonedTime(new Date(), config.TZ),
          {
            locale: koLocale,
            addSuffix: true
          }
        )
      );
    }
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
      <div className='rounded-xl min-w-[100px] bg-white/5 isolate overflow-hidden [&>a>.page-cover]:brightness-75 [&:hover>a>.page-cover]:brightness-100 [&:hover>a>.page-cover>div>img]:scale-[1.05]'>
        <Link href={title ? `/${title}-${block.id.slice(0, 8)}` : `/${block.id}`}>
          <a>
            <div className='page-cover h-48 transition-[filter] duration-200 ease-linear bg-white/5 [&>div>img]:trasnition-transform [&>div>img]:duration-200 [&>div>img]:ease-linear [&>div>img]:w-full [&>div>img]:h-full'>
              {block?.cover ? (
                <NotionSecureImage
                  src={block?.cover?.file?.url ?? block?.cover?.external?.url ?? ''}
                  blockId={block.id}
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
                  />
                ) : (
                  <div className='notion-database-item-empty-cover'>
                    <SiNotion />
                  </div>
                )
              ) : (
                <div className='notion-database-item-empty-cover'>
                  <SiNotion />
                </div>
              )}
            </div>
            <div className='flex items-center justify-between px-3 py-2 gap-x-2'>
              <div className='overflow-hidden max-h-[3.3em] [&>div>p]:line-clamp-2 [&>div>a]:line-clamp-2 [&>div>span]:line-clamp-2'>
                {block?.properties?.title?.title && (
                  <Paragraph blockId={block.id} richText={block?.properties?.title?.title} />
                )}
              </div>
              <div className='whitespace-nowrap'>
                <p>{createdAt}</p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
}, isEqual);
ChildDatabaseBlock.displayName = 'ChildDatabaseBlock';

const VideoBlock: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  return (
    <>
      <NoSsrWrapper>
        <VideoBlockInner block={block}></VideoBlockInner>
      </NoSsrWrapper>
      {Array.isArray(block?.video?.caption) && block?.video?.caption?.length > 0 && (
        <div className='w-full'>
          <Paragraph blockId={block.id} richText={block.video.caption} color={'gray'} />
        </div>
      )}
    </>
  );
};

const VideoBlockInner: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  const { data, error, isValidating } = useSWR<NotionBlock>(
    `${config.path}/notion/blocks/${block.id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 55 * 60 * 1000 // 55분
    }
  );
  if (error) {
    return (
      <div className='w-full'>
        <div className='flex-center py-0.5 bg-gray-900'>
          <div className='flex items-center text-notionColor-red'>
            <IoClose />
          </div>
          &nbsp;
          <p>비디오 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  if (isValidating || !data?.video?.file?.url) {
    return (
      <div className='w-full'>
        <div className='flex-center h-[50vw] max-h-[20rem] bg-notionColor-gray_background'>
          <p>비디오 정보를 불러오고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <video className='w-full' controls src={data?.video.file?.url} />
    </div>
  );
};

interface NotionSecureImageProps extends ImageProps {
  src: string;
  table?: string;
  blockId: string;
}

const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  children,
  src: srcProp,
  blockId,
  table = 'block',
  placeholder = 'blur',
  blurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  layout = 'fill',
  objectFit = 'cover',
  ...props
}) => {
  // try {
  // // src: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
  // // pageId: 12345678-abcd-1234-abcd-123456789012
  // const { host } = new URL(srcProp);

  // if (NEXT_IMAGE_DOMAINS.includes(host)) {
  //   const src = awsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table });

  //   return (
  //     <div className="relative w-full h-full font-[0px]">
  //       <Image
  //         className={'image'}
  //         {...props}
  //         placeholder={placeholder}
  //         blurDataURL={blurDataURL}
  //         layout={layout}
  //         objectFit={objectFit}
  //         src={src}
  //       />
  //     </div>
  //   );
  // }
  //   throw '';
  // } catch (e) {
  // }
  return (
    <div className='image-wrapper'>
      <img
        className={'image'}
        {...props}
        src={awsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table })}
        loading='lazy'
      />
    </div>
  );
};

function notionBlockUrlToRelativePath(url: string): string {
  const { customDomain, notionSoRegExp, notionSiteRegExp } = config?.notion;

  if (!url || !customDomain || !notionSoRegExp || !notionSiteRegExp) {
    return url;
  }
  if (notionSoRegExp.test(url)) {
    return url.replace(notionSoRegExp, '/');
  }
  if (notionSiteRegExp.test(url)) {
    return url.replace(notionSiteRegExp, '/');
  }
  return url;
}

function awsImageObjectUrlToNotionUrl({
  blockId,
  s3ObjectUrl,
  table = 'block'
}: {
  s3ObjectUrl: string;
  blockId: string;
  table?: string;
}) {
  // s3ObjectUrl: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
  // pageId: 12345678-abcd-1234-abcd-123456789012
  try {
    if (!table || !blockId || !s3ObjectUrl) {
      return s3ObjectUrl;
    }
    const s3Url = new URL(s3ObjectUrl);

    if (
      !s3Url?.origin?.includes('amazonaws.com') ||
      !s3Url?.pathname?.includes('secure.notion-static.com')
    ) {
      return s3ObjectUrl;
    }

    const s3FileUuid = s3Url.pathname.replace(/^\/secure\.notion\-static\.com\//, '');

    if (!s3FileUuid) {
      return s3ObjectUrl;
    }

    return `https://www.notion.so/image/${encodeURIComponent(
      'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/' + s3FileUuid
    )}?table=${table}&id=${blockId}`;
  } catch (e) {
    return s3ObjectUrl;
  }
}

NotionRender.displayName = 'NotionRender';

export default NotionRender;
