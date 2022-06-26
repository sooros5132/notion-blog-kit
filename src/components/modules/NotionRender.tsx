import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { NotionBlock, NotionBlocksChildrenList } from 'src/types/notion';
import useSWR from 'swr';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { CircularProgress } from '@mui/material';

interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
}

const RichTextContainer = styled('div')(({ theme }) => ({
  lineHeight: 1.5
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
    paddingTop: theme.size.px3,
    paddingBottom: theme.size.px3,
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

const NotionRender: React.FC<NotionRenderProps> = (): JSX.Element => {
  const theme = useTheme();
  const { data: blocks } = useSWR<NotionBlocksChildrenList>('/notion/blocks/children/list');
  const { data: pages } = useSWR<GetPageResponse>('/notion/pages');

  // const { data, error } = useSWR("/key", fetch);

  if (!blocks || !blocks?.results || !pages) {
    return <CircularProgress size={20} />;
  }

  return (
    <>
      {blocks.results.map((block, i) => {
        switch (block.type) {
          case 'child_database': {
            return <ChildDatabase block={block} key={`block-${block.id}-${block.type}`} />;
          }
          case 'bookmark': {
            break;
          }
          case 'heading_1':
          case 'heading_2':
          case 'heading_3': {
            return <Heading block={block} key={`block-${block.id}-${block.type}`} />;
          }
          case 'paragraph': {
            return <Paragraph block={block} key={`block-${block.id}-${block.type}`} />;
          }
          default: {
            break;
          }
        }
      })}
    </>
  );
};

type NotionChildrenRenderProps = { block: NotionBlock };
const Heading: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
  return (
    <RichTextContainer>
      {block[type].rich_text.map((text, i) => {
        return <span key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</span>;
      })}
    </RichTextContainer>
  );
};
const Paragraph: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  return (
    <RichTextContainer>
      {block.paragraph.rich_text.map((text, i) => {
        if (text.type === 'mention') {
          return (
            <></>
            // <ParagraphText key={`block-${block.id}-${block.type}-${text.type}-${i}`}>
            //   mention
            // </ParagraphText>
          );
        }

        const {
          type,
          plain_text,
          annotations: { bold, code, italic, strikethrough, underline }
        } = text;

        const prevTextIsCode = code && block.paragraph.rich_text[i - 1]?.annotations.code;
        const nextTextIsCode = code && block.paragraph.rich_text[i + 1]?.annotations.code;

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

        return (
          <ParagraphText key={`block-${block.id}-${block.type}-${type}-${i}`} {...annotations}>
            {plain_text}
          </ParagraphText>
        );
      })}
    </RichTextContainer>
  );
};

const ChildDatabase: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  return <div>database: {block.child_database.title}</div>;
};

NotionRender.displayName = 'NotionRender';

export default NotionRender;
