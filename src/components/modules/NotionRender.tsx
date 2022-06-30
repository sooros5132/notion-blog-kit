import React from 'react';
import { styled } from '@mui/material/styles';
import {
  NotionBlock,
  IGetNotion,
  NotionPagesRetrieve,
  RichText,
  NotionBlocksChildrenList,
  Color
} from 'src/types/notion';
import useSWR from 'swr';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { useRef } from 'react';
import { useState } from 'react';
import { TiChevronRight } from 'react-icons/ti';

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

const PageInfoContainer = styled('div')(({ theme }) => ({}));

const PageInfoCover = styled('div')(({ theme }) => ({
  width: '100%',
  height: '30vh'
}));

const PageInfoInner = styled('div')<{ emoji?: 'true' | 'false' }>(({ emoji, theme }) => ({
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto',
  marginTop: emoji === 'true' ? `-${theme.size.px50}` : undefined,
  [theme.mediaQuery.mobile]: {
    paddingRight: theme.size.px12,
    paddingLeft: theme.size.px12
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

const PageEmoji = styled('span')(({ theme }) => ({
  padding: `0 ${theme.size.px12}`,
  fontSize: theme.size.px70,
  fontWeight: 'bold',
  fontFamily: 'initial'
}));

const PageTitle = styled('div')<{ emoji?: 'true' | 'false' }>(({ emoji, theme }) => ({
  marginTop: emoji === 'true' ? theme.size.px10 : theme.size.px50,
  fontSize: theme.size.px40,
  fontWeight: 'bold',
  lineHeight: '1'
}));

const NotionContent = styled('div')(({ theme }) => ({
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto',
  lineHeight: '1.2',
  [theme.mediaQuery.mobile]: {
    paddingRight: theme.size.px12,
    paddingLeft: theme.size.px12
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
  margin: theme.size.px6 + ' 0'
}));

const DepthBlock = styled('div')(({ theme }) => ({
  marginLeft: theme.size.px26
}));

const HorizontalRule = styled('hr')(({ theme }) => ({
  borderColor: theme.color.gray50
}));

const RichTextContainer = styled('div')(({ theme }) => ({
  lineHeight: 'inherit',
  minHeight: '1.25em',
  whiteSpace: 'break-spaces',
  wordBreak: 'break-all'
}));

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

const NumberedListItemContainer = styled('div')(({}) => ({
  display: 'flex'
}));
const NumberedListItemNumber = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: `0 0 ${theme.size.px26}`,
  textAlign: 'right',
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

const DatabaseItemCoverImage = styled('div')({
  width: '100%',
  height: '100%',
  position: 'relative',
  zIndex: -1
  // objectFit: 'cover',
  // objectPosition: 'center center',
});

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<IGetNotion>('/notion/blocks/children/list/' + slug);
  const { data: pages } = useSWR<NotionPagesRetrieve>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocks?.results || !pages) {
    return <CircularProgress size={20} />;
  }

  return (
    <NotionContainer>
      <NextSeo
        title={
          pages.parent.type === 'workspace' && pages.properties.title?.title
            ? pages.properties.title?.title?.map((text) => text?.plain_text).join('') || 'soolog'
            : pages.parent.type === 'database_id' && pages.properties?.['이름']?.title
            ? pages.properties?.['이름']?.title
                ?.map((text: RichText) => text?.plain_text)
                .join('') || 'untitled'
            : 'soolog'
        }
      />

      <PageInfoContainer>
        {pages?.cover?.[pages?.cover?.type]?.url && (
          <PageInfoCover>
            <DatabaseItemCoverImage>
              <Image
                src={pages?.cover?.[pages?.cover?.type]?.url!}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='
                layout='fill'
                objectFit='cover'
              />
            </DatabaseItemCoverImage>
          </PageInfoCover>
        )}
        <PageInfoInner emoji={`${Boolean(pages.icon?.emoji)}`}>
          {pages.icon?.emoji && <PageEmoji>{pages.icon?.emoji}</PageEmoji>}
          <PageTitle emoji={`${Boolean(pages.icon?.emoji)}`}>
            {pages.parent.type === 'workspace' ? (
              <Paragraph blockId={pages.id} richText={pages.properties.title?.title} />
            ) : pages.parent.type === 'database_id' ? (
              <Paragraph blockId={pages.id} richText={pages.properties?.['이름']?.title} />
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
                <Heading block={block} />
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
                <Paragraph blockId={block.id} richText={block.paragraph.rich_text} />
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
                    <Paragraph blockId={block.id} richText={block.numbered_list_item.rich_text} />
                  </NumberedListItemInner>
                </NumberedListItemContainer>
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
const Heading: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  return (
    <RichTextContainer>
      {block[type].rich_text.map((text, i) => {
        switch (type) {
          case 'heading_1': {
            return <h1 key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</h1>;
          }
          case 'heading_2': {
            return <h2 key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</h2>;
          }
          case 'heading_3': {
            return <h3 key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</h3>;
          }
          default: {
            return <span key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</span>;
          }
        }
      })}
    </RichTextContainer>
  );
};

interface ParagraphProps {
  blockId: string;
  richText: Array<RichText>;
}

const Paragraph: React.FC<ParagraphProps> = ({ blockId, richText }) => {
  return (
    <RichTextContainer>
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
          <Paragraph blockId={block.id} richText={block.toggle.rich_text} />
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
      <h1>{block.child_database.title}</h1>
      <DatabaseContainer>
        {database.results.map((database) => (
          <DatabaseFlexItem key={`database-${database.id}`}>
            <Link href={`/${database.id}`}>
              <a>
                <DatabaseItemCover className='page-cover'>
                  {database?.cover && (
                    <DatabaseItemCoverImage>
                      <Image
                        src={database.cover.file.url}
                        placeholder='blur'
                        blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='
                        layout='fill'
                        objectFit='cover'
                      />
                    </DatabaseItemCoverImage>
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

NotionRender.displayName = 'NotionRender';

export default NotionRender;
