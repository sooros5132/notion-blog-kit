import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { NotionBlock, NotionBlocksChildrenList, RichText } from 'src/types/notion';
import useSWR from 'swr';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { CircularProgress } from '@mui/material';
import Link from 'next/link';

interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
  readonly slug: string;
}

const NotionContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: theme.size.desktopWidth,
  margin: '0 auto'
}));

const RichTextContainer = styled('div')(({ theme }) => ({
  lineHeight: 1.8,
  minHeight: '1.8em',
  whiteSpace: 'break-spaces'
}));

const ParagraphText = styled('span')<{
  bold?: string;
  italic?: string;
  strikethrough?: string;
  underline?: string;
  code?: 'once' | 'first' | 'end' | 'middle';
}>(({ theme, bold, italic, strikethrough, underline, code }) => {
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

  return {
    fontWeight: bold,
    fontStyle: italic,
    textDecoration: `${strikethrough ? strikethrough : ''} ${underline ? underline : ''}`,
    ...codeStyle
  };
});

const ParagraphAnchor = styled('a')({
  textDecoration: 'underline'
});

const UnderlineSpan = styled('span')({
  textDecoration: 'underline'
});

const DatabaseContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: 20,
  rowGap: 20,
  textAlign: 'center',
  '& > div': {
    flex: '0 0 33.333333%'
  }
}));
const DatabaseFlexItem = styled('div')(({ theme }) => ({
  borderRadius: theme.size.px10,
  minWidth: 100,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
  '&:hover img.page-cover': {
    filter: 'brightness(0.75)'
  }
}));

const DatabaseDescriptionBox = styled('div')(({ theme }) => ({
  padding: theme.size.px8
}));

const DatabaseItemCover = styled('div')({
  height: 200
});

const DatabaseItemCoverImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center center',
  transition: 'filter 0.2s Linear'
});

const NotionRender: React.FC<NotionRenderProps> = ({ slug }): JSX.Element => {
  const { data: blocks } = useSWR<NotionBlocksChildrenList>('/notion/blocks/children/list/' + slug);
  const { data: pages } = useSWR<GetPageResponse>('/notion/pages/' + slug);

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks?.blocksChildrenList?.results || !pages) {
    return <CircularProgress size={20} />;
  }

  return (
    <NotionContainer>
      {blocks.blocksChildrenList.results.map((block, i) => {
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
            return <Heading block={block} key={`block-${block.id}-${i}`} />;
          }
          case 'paragraph': {
            return (
              <Paragraph
                blockId={block.id}
                richText={block.paragraph.rich_text}
                key={`block-${block.id}-${i}`}
              />
            );
          }
          default: {
            return <React.Fragment key={`block-${block.id}-${i}`}></React.Fragment>;
          }
        }
      })}
    </NotionContainer>
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
          annotations: { bold, code, italic, strikethrough, underline }
        } = text;

        const prevTextIsCode = code && richText[i - 1]?.annotations.code;
        const nextTextIsCode = code && richText[i + 1]?.annotations.code;

        const annotations: Partial<typeof ParagraphText['defaultProps']> = {
          bold: bold ? 'bold' : undefined,
          italic: italic ? 'italic' : undefined,
          strikethrough: strikethrough ? 'line-through' : undefined,
          underline: underline ? 'underline' : undefined,
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
              href={href}
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

interface ChildDatabaseProps extends NotionChildrenRenderProps {
  databases: NotionBlocksChildrenList['databaseBlocks'];
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
                <DatabaseItemCover>
                  {database?.cover && (
                    <DatabaseItemCoverImage className='page-cover' src={database.cover.file.url} />
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
