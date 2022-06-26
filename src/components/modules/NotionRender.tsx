import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { BlockType, NotionBlock, NotionBlocksChildrenList } from 'src/types/notion';
import useSWR from 'swr';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { CircularProgress } from '@mui/material';

interface NotionRenderProps {
  // readonly blocks: Array<NotionBlock>;
}

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
    <p>
      {block[type].rich_text.map((text, i) => {
        return <span key={`block-${block.id}-${type}-${i}`}>{text.plain_text}</span>;
      })}
    </p>
  );
};
const Paragraph: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  return (
    <p>
      {block.paragraph.rich_text.map((text, i) => {
        if (text.type === 'mention') {
          return <span key={`block-${block.id}-${block.type}-${text.type}-${i}`}>mention</span>;
        }
        return (
          <span key={`block-${block.id}-${block.type}-${text.type}-${i}`}>{text.plain_text}</span>
        );
      })}
    </p>
  );
};

const ChildDatabase: React.FC<NotionChildrenRenderProps> = ({ block }) => {
  return <p>database: {block.child_database.title}</p>;
};

NotionRender.displayName = 'NotionRender';

export default NotionRender;
