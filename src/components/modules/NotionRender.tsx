import React from 'react';
import { styled } from '@mui/material/styles';
import { NotionBlock, IGetNotion, NotionPagesRetrieve, RichText, Color } from 'src/types/notion';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import { NextSeo } from 'next-seo';
import { useRef } from 'react';
import { useState } from 'react';
import { TiChevronRight } from 'react-icons/ti';
import Head from 'next/head';
import { NEXT_IMAGE_DOMAINS } from 'src/lib/constants';

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

const PageInfoCover = styled('div')({
  width: '100%',
  height: '30vh'
});

const PageInfoInner = styled('div')<{
  icontype?: NotionPagesRetrieve['icon']['type'];
  cover?: 'true' | 'false';
}>(({ icontype, theme, cover }) => ({
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto',
  marginTop: cover === 'true' && icontype === 'emoji' ? `-${theme.size.px50}` : undefined,
  paddingTop:
    icontype === 'file' || (cover === 'false' && icontype === 'emoji')
      ? theme.size.px50
      : undefined,
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
  marginTop: icontype === 'emoji' ? theme.size.px10 : theme.size.px50,
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
  const fontColor = color && !color.match(/_background$/) && theme.color[`notionColor_${color}`];
  const backgroundColor =
    color && color.match(/_background$/) && theme.color[`notionColor_${color}`];

  return {
    padding: theme.size.px2,
    minHeight: '1.25em',
    whiteSpace: 'break-spaces',
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

  const fontColor = color && !color.match(/_background$/) && theme.color[`notionColor_${color}`];
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
  '&:hover .page-cover': {
    filter: 'brightness(0.75)'
  }
}));

const DatabaseDescriptionBox = styled('div')(({ theme }) => ({
  padding: theme.size.px8
}));

const DatabaseItemCover = styled('div')({
  height: 200,
  transition: 'filter 0.2s Linear'
});

const DefaultImageWrapper = styled('div')({
  width: '100%',
  height: '100%',
  position: 'relative',
  // zIndex: -1,
  '& > img': {
    // width: '100%',
    // height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center'
  }
});

const NextImageWrapper = styled(DefaultImageWrapper)({
  width: '100%',
  height: '100%',
  position: 'relative',
  zIndex: -1
  // objectFit: 'cover',
  // objectPosition: 'center center',
});

const Heading = styled('div')({
  marginTop: '1.4em'
});

const Heading1 = styled('h1')({ margin: 0 });

const Heading2 = styled('h2')({ margin: 0 });

const Heading3 = styled('h3')({ margin: 0 });

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<IGetNotion>('/notion/blocks/children/list/' + slug);
  const { data: page } = useSWR<NotionPagesRetrieve>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocks?.results || !page) {
    return <CircularProgress size={20} />;
  }

  return (
    <NotionContainer>
      <NextSeo
        title={
          page.parent.type === 'workspace' && page.properties.title?.title
            ? page.properties.title?.title?.map((text) => text?.plain_text).join('') || 'soolog'
            : page.parent.type === 'database_id' && page.properties?.['이름']?.title
            ? page.properties?.['이름']?.title
                ?.map((text: RichText) => text?.plain_text)
                .join('') || 'untitled'
            : 'soolog'
        }
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
            <NotionSecureImage blockId={page.id} src={page?.cover?.[page?.cover?.type]?.url!} />
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
            {page.parent.type === 'workspace' ? (
              <Paragraph blockId={page.id} richText={page.properties.title?.title} />
            ) : page.parent.type === 'database_id' ? (
              <Paragraph blockId={page.id} richText={page.properties?.['이름']?.title} />
            ) : null}
          </PageTitle>
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
      {blocks.blocks.results.map((block, i) => {
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
                <Paragraph blockId={block.id} richText={block.image.caption} />
                <NotionSecureImage blockId={block.id} src={block.image.external.url} />
              </NotionBlockRender>
            );
          }
        }

        return <React.Fragment key={`block-${block.id}-${i}`}></React.Fragment>;
      })}
    </div>
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
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  return (
    <RichTextContainer>
      {block[type].rich_text.map((text, i) => {
        switch (type) {
          case 'heading_1': {
            return (
              <Heading1 key={`block-${block.id}-${type}-${i}`}>
                <Heading>
                  <Paragraph
                    blockId={block.id}
                    richText={block[type].rich_text}
                    color={block[type].color}
                  />
                </Heading>
              </Heading1>
            );
          }
          case 'heading_2': {
            return (
              <Heading2 key={`block-${block.id}-${type}-${i}`}>
                <Heading>
                  <Paragraph
                    blockId={block.id}
                    richText={block[type].rich_text}
                    color={block[type].color}
                  />
                </Heading>
              </Heading2>
            );
          }
          case 'heading_3': {
            return (
              <Heading3 key={`block-${block.id}-${type}-${i}`}>
                <Heading>
                  <Paragraph
                    blockId={block.id}
                    richText={block[type].rich_text}
                    color={block[type].color}
                  />
                </Heading>
              </Heading3>
            );
          }
        }
      })}
    </RichTextContainer>
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
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClickToggleButton = () => {
    setOpen((prev) => !prev);
  };
  return (
    <NotionBlockRender
      block={block}
      blocks={blocks}
      chilrenBlockDepth={isOpen ? chilrenBlockDepth : undefined}
    >
      <NumberedListItemContainer>
        <ToggleArrowBox onClick={handleClickToggleButton} toggled={`${isOpen}`}>
          <TiChevronRight />
        </ToggleArrowBox>
        <NumberedListItemInner>
          <Paragraph
            blockId={block.id}
            richText={block.toggle.rich_text}
            color={block.toggle.color}
          />
        </NumberedListItemInner>
      </NumberedListItemContainer>
    </NotionBlockRender>
  );
};

interface ChildDatabaseProps extends NotionChildrenRenderProps {
  databases: IGetNotion['databaseBlocks'];
}

const ChildDatabase: React.FC<ChildDatabaseProps> = ({ block, databases }) => {
  const database = databases[block.id];
  return (
    <div>
      <Heading>
        <Heading1>{block.child_database.title}</Heading1>
      </Heading>

      <DatabaseContainer>
        {database.results.map((database) => (
          <DatabaseFlexItem key={`database-${database.id}`}>
            <Link href={`/${database.id}`}>
              <a>
                <DatabaseItemCover className='page-cover'>
                  {database?.cover && (
                    <NotionSecureImage src={database?.cover?.file?.url} blockId={database.id} />
                  )}
                </DatabaseItemCover>
                <DatabaseDescriptionBox>
                  <Paragraph
                    blockId={database.id}
                    richText={database?.properties?.['이름']?.title}
                  />
                </DatabaseDescriptionBox>
              </a>
            </Link>
          </DatabaseFlexItem>
        ))}
      </DatabaseContainer>
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
  // src: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
  // pageId: 12345678-abcd-1234-abcd-123456789012
  const { host } = new URL(srcProp);

  if (NEXT_IMAGE_DOMAINS.includes(host)) {
    const src = convertAwsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table });

    return (
      <NextImageWrapper>
        <Image
          {...props}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          layout={layout}
          objectFit={objectFit}
          src={src}
        />
      </NextImageWrapper>
    );
  }

  return (
    <DefaultImageWrapper>
      <img {...props} src={srcProp}></img>
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
