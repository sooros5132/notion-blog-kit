import React, { useMemo, memo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  NotionBlock,
  IGetNotion,
  NotionPagesRetrieve,
  RichText,
  Color,
  NotionDatabase
} from 'src/types/notion';
import useSWR from 'swr';
import { Button, CircularProgress, Menu, MenuItem, Typography } from '@mui/material';
import Link from 'next/link';
import { ImageProps } from 'next/image';
import { NextSeo } from 'next-seo';
import { useRef } from 'react';
import { useState } from 'react';
import { TiChevronRight } from 'react-icons/ti';
import Head from 'next/head';
import {
  CursorPointerBox,
  Flex11AutoBox,
  FlexAlignItemsCenterBox,
  FlexBox,
  FlexCenterCenterBox,
  FlexSpaceBetweenCenterBox,
  FullWidthBox,
  GridBox,
  MarginRightPx4,
  NoWrapBox
} from './Box';
import { sortBy } from 'lodash';
import { BsArrowDownShort, BsArrowUpShort, BsDot } from 'react-icons/bs';
import isEqual from 'react-fast-compare';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { BreakAllTypography } from './Typography';
import { SiNotion } from 'react-icons/si';
import config from 'site-setting';
import { formatDistance } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { ko as koLocale } from 'date-fns/locale';
import { copyTextAtClipBoard } from 'src/lib/utils';
import { useRouter } from 'next/router';
import NoSsrWrapper from './NoSsrWrapper';
import { useBrowserLayoutEffect } from 'src/lib/useBrowserLayoutEffect';

interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
  readonly slug: string;
}

const NotionContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: theme.size.px20,
  fontSize: theme.size.px16,
  color: theme.color.textDefaultBlack
}));

const PageInfoContainer = styled('div')();

const ImageCover = styled('div')({
  width: '100%',
  '& > div': {
    width: '100%',
    height: '100%',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center center'
    }
  }
});

const PageInfoCover = styled(ImageCover)({
  height: '30vh',
  '& img.image': {
    zIndex: -1
  }
});

const PageInfoInner = styled('div')<{
  icontype?: NotionPagesRetrieve['icon']['type'];
  cover?: 'true' | 'false';
}>(({ icontype, theme, cover }) => ({
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto',
  marginTop:
    cover === 'true'
      ? icontype === 'emoji'
        ? `-${theme.size.px50}`
        : icontype === 'file'
        ? `-${theme.size.px34}`
        : undefined
      : undefined,
  paddingTop: icontype === 'file' && cover === 'false' ? theme.size.px50 : undefined,
  [theme.mediaQuery.mobile]: {
    paddingRight: theme.size.px18,
    paddingLeft: theme.size.px18
  },
  [theme.mediaQuery.tablet]: {
    paddingRight: theme.size.px24,
    paddingLeft: theme.size.px24
  },
  [theme.mediaQuery.laptop]: {
    paddingRight: theme.size.px40,
    paddingLeft: theme.size.px40
  }
}));

const PageImage = styled('div')({
  position: 'relative',
  width: 70,
  height: 70
});

const PageEmoji = styled('span')(({ theme }) => ({
  padding: `0 ${theme.size.px12}`,
  fontSize: theme.size.px70,
  fontWeight: 'bold',
  fontFamily: 'emoji'
}));

const PageTitle = styled('div')<{
  icontype?: NotionPagesRetrieve['icon']['type'];
  cover?: 'true' | 'false';
}>(({ icontype, theme, cover }) => ({
  marginTop:
    cover === 'true' && (icontype === 'emoji' || icontype === 'file')
      ? theme.size.px20
      : theme.size.px50,
  fontSize: theme.size.px40,
  fontWeight: 'bold',
  lineHeight: '1'
}));

const NotionContent = styled('div')(({ theme }) => ({
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto',
  [theme.mediaQuery.mobile]: {
    paddingRight: theme.size.px18,
    paddingLeft: theme.size.px18
  },
  [theme.mediaQuery.tablet]: {
    paddingRight: theme.size.px24,
    paddingLeft: theme.size.px24
  },
  [theme.mediaQuery.laptop]: {
    paddingRight: theme.size.px40,
    paddingLeft: theme.size.px40
  }
}));

const Block = styled('div')(({ theme }) => ({
  margin: theme.size.px2 + ' 0'
}));

const DepthBlock = styled('div')(({ theme }) => ({
  marginLeft: theme.size.px26
}));

const HorizontalRule = styled('hr')(({ theme }) => ({
  borderColor: theme.color.gray50
}));

const RichTextContainer = styled('div')<{
  color?: Color;
}>(({ theme, color }) => {
  const fontColor =
    color &&
    color !== 'default' &&
    !color.match(/_background$/) &&
    theme.color[`notionColor_${color}`];
  const backgroundColor =
    color && color.match(/_background$/) && theme.color[`notionColor_${color}`];

  return {
    padding: theme.size.px2,
    minHeight: '1.25em',
    wordBreak: 'break-all',
    color: fontColor ? fontColor : undefined,
    backgroundColor: backgroundColor ? backgroundColor : undefined
  };
});

const ParagraphText = styled('span')<{
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'end' | 'middle';
  color?: Color;
}>(({ theme, bold, italic, strikethrough, underline, code, color }) => {
  const codeStyle = code && {
    fontFamily: theme.font.code,
    backgroundColor: theme.color.redBackgroundLight,
    borderTopLeftRadius: code === 'once' || code === 'first' ? theme.size.px4 : undefined,
    borderBottomLeftRadius: code === 'once' || code === 'first' ? theme.size.px4 : undefined,
    borderTopRightRadius: code === 'once' || code === 'end' ? theme.size.px4 : undefined,
    borderBottomRightRadius: code === 'once' || code === 'end' ? theme.size.px4 : undefined,
    paddingTop: theme.size.px2,
    paddingBottom: theme.size.px2,
    paddingLeft: code === 'once' || code === 'first' ? theme.size.px4 : undefined,
    paddingRight: code === 'once' || code === 'end' ? theme.size.px4 : undefined
  };

  const fontColor =
    color &&
    color !== 'default' &&
    !color.match(/_background$/) &&
    theme.color[`notionColor_${color}`];
  const backgroundColor =
    color && color.match(/_background$/) && theme.color[`notionColor_${color}`];

  return {
    fontWeight: bold,
    fontStyle: italic,
    textDecoration: `${strikethrough ? strikethrough : ''} ${underline ? underline : ''}`,
    color: fontColor ? fontColor : undefined,
    backgroundColor: backgroundColor ? backgroundColor : undefined,
    ...codeStyle
  };
});

const NumberedListItemContainer = styled('div')({
  display: 'flex'
});
const NumberedListItemNumber = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  flex: `0 0 ${theme.size.px26}`,
  textAlign: 'right',
  padding: theme.size.px2 + ' 0',
  paddingRight: theme.size.px4
}));

const NumberedListItemInner = styled('div')(({}) => ({
  flex: `1 1 auto`
}));

const ToggleArrowBox = styled(NumberedListItemNumber)<{ toggled: 'true' | 'false' }>(
  ({ toggled }) => ({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.2em',
    transform: toggled === 'true' ? 'rotate(90deg)' : undefined,
    transition: 'transform 0.15s'
  })
);

const ParagraphAnchor = styled('a')(({ theme }) => ({
  textDecoration: 'underline',
  color: theme.color.gray85
}));

const UnderlineSpan = styled('span')({
  textDecoration: 'underline'
});

const DatabaseContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: 20,
  textAlign: 'center',
  marginBottom: 20,
  [theme.mediaQuery.mobile]: {
    gridTemplateColumns: '1fr'
  },
  [theme.mediaQuery.tablet]: {
    gridTemplateColumns: '1fr 1fr'
  },
  [theme.mediaQuery.laptop]: {
    gridTemplateColumns: '1fr 1fr 1fr'
  }
}));

const DatabaseFlexItem = styled('div')(({ theme }) => ({
  borderRadius: theme.size.px10,
  minWidth: 100,
  backgroundColor: theme.color.cardBackground,
  /**
   * Safari 브라우저 borderRadius 오류.
   * 쌓임 맥락에 추가 https://www.sungikchoi.com/blog/safari-overflow-border-radius/
   * isolation: isolate
   * will-change: transform;
   * 추가하기
   */
  isolation: 'isolate',
  overflow: 'hidden',
  '& .page-cover': {
    filter: 'brightness(0.75)'
  },
  '&:hover .page-cover': {
    filter: 'brightness(1)',
    '& .image': {
      transform: 'scale(1.05)'
    }
  }
}));

const DatabaseDescriptionBox = styled(FlexSpaceBetweenCenterBox)(({ theme }) => ({
  columnGap: theme.size.px8,
  padding: `${theme.size.px8} ${theme.size.px12}`
}));

const DatabaseItemCover = styled(ImageCover)(({ theme }) => ({
  height: 200,
  transition: 'filter 0.2s Linear',
  backgroundColor: theme.color.cardBackground,
  '& .image': {
    transition: 'transform 0.2s Linear'
  }
}));

const DefaultImageWrapper = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  fontSize: 0,
  '& > img': {
    position: 'relative',
    maxWidth: '100%'
  }
});

const NextImageWrapper = styled(DefaultImageWrapper)({
  position: 'relative',
  width: '100%',
  height: '100%',
  fontSize: 0
  // objectFit: 'cover',
  // objectPosition: 'center center',
});

const ImageBlockContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center'
});

const HeadingContainer = styled('div')(({ theme }) => ({
  paddingTop: '2.1em',
  marginBottom: theme.size.px4
}));

const Heading = styled(FlexBox)<{
  type: 'heading_1' | 'heading_2' | 'heading_3' | 'child_database';
}>(({ type, theme }) => ({
  fontWeight: 'bold',
  fontSize:
    type === 'heading_1' || type === 'child_database'
      ? '2em'
      : type === 'heading_2'
      ? '1.5em'
      : '1.2em',
  '& .heading-link': {
    display: 'none'
  },
  '&:hover .heading-link': {
    display: 'block'
  }
}));

export const EllipsisWrapperBox = styled('div')({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxHeight: '3.1em',
  textOverflow: 'ellipsis',
  '& p, a, span': {
    display: '-webkit-box',
    whiteSpace: 'normal',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '2'
  }
});

// const CodeBlock = styled('div')(({ theme }) => ({
//   fontFamily: theme.font.code,
//   backgroundColor: theme.color.cardBackground,
//   padding: `${theme.size.px6} ${theme.size.px12}`
// }));
const CalloutBlockContainer = styled('div')<{ color: Color }>(({ color, theme }) => {
  const fontColor =
    color &&
    color !== 'default' &&
    !color.match(/_background$/) &&
    theme.color[`notionColor_${color}`];
  const backgroundColor =
    color && color.match(/_background$/) && theme.color[`notionColor_${color}`];

  return {
    color: fontColor ? fontColor : undefined,
    backgroundColor: backgroundColor ? backgroundColor : undefined,
    padding: `${theme.size.px6} ${theme.size.px12}`,
    paddingLeft: theme.size.px6,
    margin: theme.size.px2 + ' 0'
  };
});

const CalloutBlockHeading = styled(FlexBox)();

const CalloutIcon = styled('div')(({ theme }) => ({
  width: theme.size.px18,
  minHeight: '1.25em',
  margin: `0 ${theme.size.px3}`,
  paddingTop: theme.size.px3,
  textAlign: 'center',
  fontSize: theme.size.px18,
  fontFamily: 'emoji'
}));

const QuoteContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.color.cardBackground,
  padding: `${theme.size.px6} ${theme.size.px12}`,
  borderLeft: `${theme.size.px3} solid ${theme.color.textDefaultBlack}`
}));

const BulletedListItemDot = styled('div')(({ theme }) => ({
  flex: `0 0 ${theme.size.px26}`,
  paddingTop: theme.size.px2,
  paddingRight: theme.size.px4,
  fontSize: theme.size.px20
}));

const DatabaseItemEmptyCover = styled(FlexCenterCenterBox)(({ theme }) => ({
  fontSize: '8em',
  color: theme.color.gray15
}));

const NotionColorBox = styled('div')<{ color: Color }>(({ color, theme }) => {
  const fontColor =
    color &&
    color !== 'default' &&
    !color.match(/_background$/) &&
    theme.color[`notionColor_${color}`];
  const backgroundColor =
    color && color.match(/_background$/) && theme.color[`notionColor_${color}`];

  return {
    color: fontColor ? fontColor : undefined,
    backgroundColor: backgroundColor ? backgroundColor : undefined
  };
});

const TagContainer = styled('div')<{ color: Color }>(({ color, theme }) => {
  const backgroundColor =
    color && theme.color[`notionColor_${color}_background` as keyof typeof theme.color];
  return {
    backgroundColor: backgroundColor ? backgroundColor : undefined,
    padding: `0 ${theme.size.px6}`,
    borderRadius: theme.size.px6
  };
});

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<IGetNotion>('/notion/blocks/children/list/' + slug);
  const { data: page } = useSWR<NotionPagesRetrieve>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocks?.results || !page) {
    return <CircularProgress size={20} />;
  }
  const title =
    page.parent.type === 'workspace' && page.properties.title?.title
      ? page.properties.title?.title?.map((text) => text?.plain_text).join('') || 'soolog'
      : page.parent.type === 'database_id' && page.properties?.title?.title
      ? page.properties?.title?.title?.map((text: RichText) => text?.plain_text).join('') ||
        '제목 없음'
      : 'soolog';

  const description = blocks?.blocks?.results
    ?.slice(0, 10)
    ?.map((block) => block?.paragraph?.rich_text?.map((text) => text?.plain_text).join(''))
    .join(' ');

  const url = page?.cover
    ? page?.cover?.type === 'external'
      ? page.cover.external?.url ?? ''
      : page?.cover?.type === 'file'
      ? convertAwsImageObjectUrlToNotionUrl({
          blockId: page.id,
          s3ObjectUrl: page.cover.file?.url || ''
        })
      : ''
    : '';

  return (
    <NotionContainer>
      <NextSeo
        title={title?.slice(0, 60) || undefined}
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
            href={convertAwsImageObjectUrlToNotionUrl({
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

      <PageInfoContainer>
        {page?.cover?.[page?.cover?.type]?.url && (
          <PageInfoCover>
            <NotionSecureImage
              blockId={page.id}
              src={page?.cover?.[page?.cover?.type]?.url!}
              layout='fill'
              objectFit='cover'
            />
          </PageInfoCover>
        )}
        <PageInfoInner icontype={page.icon?.type} cover={`${Boolean(page?.cover)}`}>
          {page.icon?.file && page.icon?.type === 'file' && (
            <PageImage>
              <NotionSecureImage blockId={page.id} src={page.icon.file.url} />
            </PageImage>
          )}
          {page.icon?.emoji && page.icon?.type === 'emoji' && (
            <PageEmoji>{page.icon?.emoji}</PageEmoji>
          )}
          <PageTitle icontype={page.icon?.type} cover={`${Boolean(page?.cover)}`}>
            <Paragraph blockId={page.id} richText={page.properties?.title?.title! ?? '제목 없음'} />
          </PageTitle>
          {page.parent.type === 'database_id' && [
            Array.isArray(page.properties?.tags?.multi_select) && (
              <FlexBox key={'properties-tags'} sx={{ columnGap: 1 }}>
                {page.properties?.tags?.multi_select?.map((select) => (
                  <TagContainer color={select.color} key={`multi-select-${page.id}-${select.id}`}>
                    <Typography>{select.name}</Typography>
                  </TagContainer>
                ))}
              </FlexBox>
            ),
            <Typography
              key={'properties-createdAt-and-updatedAt'}
              sx={{ color: (theme) => theme.color.gray65 }}
            >
              {typeof page.properties?.createdAt?.created_time === 'string' &&
                `작성일: ${formatInTimeZone(
                  new Date(page.properties.createdAt.created_time),
                  config.TZ,
                  'yyyy-MM-dd aaa hh:mm',
                  {
                    locale: koLocale
                  }
                )}`}

              {typeof page.properties?.updatedAt?.last_edited_time === 'string' ? (
                <NoSsrWrapper>
                  {`, ${formatDistance(
                    utcToZonedTime(new Date(page.properties.updatedAt.last_edited_time), config.TZ),
                    utcToZonedTime(new Date(), config.TZ),
                    {
                      locale: koLocale,
                      addSuffix: true
                    }
                  )} 수정됨`}
                </NoSsrWrapper>
              ) : null}
            </Typography>
          ]}
        </PageInfoInner>
      </PageInfoContainer>
      <NotionContent>
        <NotionContentContainer blocks={blocks} />
      </NotionContent>
    </NotionContainer>
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
                <RichTextContainer>
                  <ParagraphAnchor
                    key={`block-${block.id}-${i}`}
                    href={
                      block.bookmark.url.charAt(0) === '/'
                        ? `https://notion.so${block.bookmark.url}`
                        : block.bookmark.url
                    }
                    rel='noreferrer'
                    target='_blank'
                  >
                    {block.bookmark.url}
                  </ParagraphAnchor>
                </RichTextContainer>
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
                <HorizontalRule />
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
                <NumberedListItemContainer>
                  <NumberedListItemNumber>{numberOfSameTag.current + 1}.</NumberedListItemNumber>
                  <NumberedListItemInner>
                    <Paragraph
                      blockId={block.id}
                      richText={block.numbered_list_item.rich_text}
                      color={block.numbered_list_item.color}
                    />
                  </NumberedListItemInner>
                </NumberedListItemContainer>
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
                <ImageBlockContainer>
                  <div>
                    <NotionSecureImage
                      blockId={block.id}
                      src={block.image?.file?.url ?? block.image?.external?.url ?? ''}
                    />
                    {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
                      <FullWidthBox>
                        <Paragraph
                          blockId={block.id}
                          richText={block.image.caption}
                          color={'gray'}
                        />
                      </FullWidthBox>
                    )}
                  </div>
                </ImageBlockContainer>
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
                  {block?.code?.rich_text?.map((text) => text?.plain_text)}
                </SyntaxHighlighter>
                {Array.isArray(block?.code?.caption) && block?.code?.caption?.length > 0 && (
                  <FullWidthBox>
                    <Paragraph blockId={block.id} richText={block.code.caption} color={'gray'} />
                  </FullWidthBox>
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
                <QuoteContainer>
                  <Paragraph
                    blockId={block.id}
                    richText={block.quote.rich_text}
                    color={block.quote.color}
                  />
                </QuoteContainer>
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
                <NumberedListItemContainer>
                  <BulletedListItemDot>
                    <BsDot />
                  </BulletedListItemDot>
                  <NumberedListItemInner>
                    <Paragraph
                      blockId={block.id}
                      richText={block.bulleted_list_item.rich_text}
                      color={block.bulleted_list_item.color}
                    />
                  </NumberedListItemInner>
                </NumberedListItemContainer>
              </NotionBlockRender>
            );
          }
          case 'column_list': {
            return (
              <GridBox
                key={`block-${block.id}-${i}`}
                sx={{
                  gridTemplateColumns: `repeat(${
                    blocks['childrenBlocks'][block.id]?.results.length ?? 1
                  }, 1fr)`,
                  columnGap: (theme) => theme.size.px8,
                  '& > *': {
                    overflowX: 'auto'
                  }
                }}
              >
                {blocks['childrenBlocks'][block.id]?.results.map((block, i) => {
                  return (
                    <Block key={`block-${block.id}-${i}`}>
                      <NotionContentContainer
                        blocks={{
                          blocks: blocks['childrenBlocks'][block.id],
                          childrenBlocks: blocks.childrenBlocks,
                          databaseBlocks: blocks.databaseBlocks
                        }}
                      />
                    </Block>
                  );
                })}
              </GridBox>
            );
          }
          case 'column': {
            <NotionBlockRender
              key={`block-${block.id}`}
              block={block}
              blocks={blocks}
              chilrenBlockDepth={childrenDepth.current}
            />;
            break;
          }
        }

        return <React.Fragment key={`block-${block.id}-${i}`}></React.Fragment>;
      })}
    </div>
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
        <CalloutBlockHeading>
          <CalloutIcon>
            {block.callout?.icon?.file && block.callout?.icon?.type === 'file' && (
              <NotionSecureImage blockId={block.id} src={block.callout?.icon.file.url} />
            )}
            {block.callout?.icon?.emoji &&
              block.callout?.icon?.type === 'emoji' &&
              block.callout?.icon?.emoji}
          </CalloutIcon>
          <Paragraph blockId={block.id} richText={block.callout.rich_text} />
        </CalloutBlockHeading>
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
    <Block>
      {children}
      {block?.has_children && typeof chilrenBlockDepth === 'number' && chilrenBlockDepth > 0 && (
        <DepthBlock>
          <NotionContentContainer
            blocks={{
              blocks: blocks['childrenBlocks'][block.id],
              childrenBlocks: blocks.childrenBlocks,
              databaseBlocks: blocks.databaseBlocks
            }}
          />
        </DepthBlock>
      )}
    </Block>
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
        <FlexAlignItemsCenterBox>
          <CopyHeadingLink href={href}>
            <a href={'#' + hash}>🔗</a>
          </CopyHeadingLink>
        </FlexAlignItemsCenterBox>
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
    <MarginRightPx4 className='heading-link' onClick={handleClick(href)}>
      {children}
    </MarginRightPx4>
  );
};

interface ParagraphProps {
  blockId: string;
  richText: Array<RichText>;
  color?: Color;
}

const Paragraph: React.FC<ParagraphProps> = ({ blockId, richText, color }) => {
  return (
    <RichTextContainer color={color}>
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

        const annotations: Partial<typeof ParagraphText['defaultProps']> = {
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
              : 'end'
            : undefined
        };

        if (href) {
          return (
            <ParagraphAnchor
              key={`block-anchor-${blockId}-${i}`}
              href={href.charAt(0) === '/' ? `https://notion.so${href}` : href}
              rel='noreferrer'
              target='_blank'
            >
              <ParagraphText {...annotations}>{plain_text}</ParagraphText>
            </ParagraphAnchor>
          );
        }
        return (
          <ParagraphText key={`block-${blockId}-${i}`} {...annotations}>
            {plain_text}
          </ParagraphText>
        );
      })}
    </RichTextContainer>
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
    <NotionColorBox color={block.toggle.color}>
      <NotionBlockRender
        block={block}
        blocks={blocks}
        chilrenBlockDepth={isOpen ? chilrenBlockDepth : undefined}
      >
        <CursorPointerBox>
          <FlexAlignItemsCenterBox onClick={handleClickToggleButton}>
            <ToggleArrowBox toggled={`${isOpen}`}>
              <TiChevronRight />
            </ToggleArrowBox>
            <NumberedListItemInner>
              <Paragraph blockId={block.id} richText={block.toggle.rich_text} />
            </NumberedListItemInner>
          </FlexAlignItemsCenterBox>
        </CursorPointerBox>
      </NotionBlockRender>
    </NotionColorBox>
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
  const [accountEl, setAccountEl] = React.useState<null | HTMLElement>(null);
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

  const handleClickSortMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAccountEl(event.currentTarget);
  };

  const handleCloseSortMenu = (prop?: typeof sortKey) => () => {
    switch (prop) {
      // 시간은 반대 개념 나머지는 정상
      case 'last_edited_time':
      case 'created_time': {
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
      case 'title': {
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
    }
    setAccountEl(null);
  };
  const hash = `${block?.child_database?.title.slice(0, 50) || ''}-${block.id.slice(0, 8)}`;
  const href = useMemo(() => `${router.asPath.replace(/\#.*/, '')}#${hash}`, [router]);

  return (
    <div>
      <HeadingContainer id={hash}>
        <Heading type={block.type as 'child_database'}>
          <FlexAlignItemsCenterBox>
            <CopyHeadingLink href={href}>
              <a href={'#' + hash}>🔗</a>
            </CopyHeadingLink>
          </FlexAlignItemsCenterBox>
          <Flex11AutoBox>
            <FlexSpaceBetweenCenterBox>
              <BreakAllTypography>{block?.child_database?.title || '제목 없음'}</BreakAllTypography>
              <NoWrapBox>
                <Button color='inherit' size='large' onClick={handleClickSortMenu}>
                  {KorKeyRecord[sortKey]}
                  {isOrderAsc ? <BsArrowUpShort /> : <BsArrowDownShort />}
                </Button>
              </NoWrapBox>
              <Menu
                anchorEl={accountEl}
                keepMounted
                open={Boolean(accountEl)}
                onClose={handleCloseSortMenu()}
              >
                <MenuItem onClick={handleCloseSortMenu('title')}>
                  <Typography>이름</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseSortMenu('created_time')}>
                  <Typography>생성일</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseSortMenu('last_edited_time')}>
                  <Typography>수정일</Typography>
                </MenuItem>
              </Menu>
            </FlexSpaceBetweenCenterBox>
          </Flex11AutoBox>
        </Heading>
      </HeadingContainer>

      <DatabaseContainer>
        {blocks.map((block) => (
          <ChildDatabaseBlock key={`database-${block.id}`} block={block} />
        ))}
      </DatabaseContainer>
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
    <DatabaseFlexItem>
      <Link href={`/${block.id}`}>
        <a>
          <DatabaseItemCover className='page-cover'>
            {block?.cover ? (
              <NotionSecureImage
                src={block?.cover?.file?.url ?? block?.cover?.external?.url ?? ''}
                blockId={block.id}
                layout='fill'
                objectFit='cover'
              />
            ) : (
              <DatabaseItemEmptyCover>
                <SiNotion />
              </DatabaseItemEmptyCover>
            )}
          </DatabaseItemCover>
          <DatabaseDescriptionBox>
            <EllipsisWrapperBox>
              {block?.properties?.title?.title && (
                <Paragraph blockId={block.id} richText={block?.properties?.title?.title} />
              )}
            </EllipsisWrapperBox>
            <NoWrapBox>
              <Typography>{createdAt}</Typography>
            </NoWrapBox>
          </DatabaseDescriptionBox>
        </a>
      </Link>
    </DatabaseFlexItem>
  );
}, isEqual);
ChildDatabaseBlock.displayName = 'ChildDatabaseBlock';

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
  //   const src = convertAwsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table });

  //   return (
  //     <NextImageWrapper>
  //       <Image
  //         className={'image'}
  //         {...props}
  //         placeholder={placeholder}
  //         blurDataURL={blurDataURL}
  //         layout={layout}
  //         objectFit={objectFit}
  //         src={src}
  //       />
  //     </NextImageWrapper>
  //   );
  // }
  //   throw '';
  // } catch (e) {
  // }
  return (
    <DefaultImageWrapper>
      <img
        className={'image'}
        {...props}
        src={convertAwsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table })}
        loading='lazy'
      />
    </DefaultImageWrapper>
  );
};

function convertAwsImageObjectUrlToNotionUrl({
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
