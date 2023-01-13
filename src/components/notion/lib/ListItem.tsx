import classNames from 'classnames';
import type React from 'react';
import type { NotionBlock, NotionBlocks } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface NumberedListItemProps {
  block: NotionBlock;
  baseBlock: NotionBlocks;
  startIndexForResultBlocks: number;
  hasChildrenDepth?: number;
  children?: React.ReactNode;
}

const numberedListStyles = ['decimal', 'lower-alpha', 'lower-roman'];
const bulletedListStyles = ['outside', 'circle', 'square'];

const NumberedListItem: React.FC<NumberedListItemProps> = ({
  block,
  baseBlock,
  hasChildrenDepth,
  startIndexForResultBlocks
}) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const prevIndexForResultBlocks = startIndexForResultBlocks - 1;
  const nextIndexForResultBlocks = startIndexForResultBlocks + 1;
  const blocks = baseBlock?.results;

  if (blocks?.[prevIndexForResultBlocks]?.type !== block.type) {
    return (
      <ul
        className={'pl-6'}
        style={{
          listStyle:
            LIST_TYPE === 'numbered_list_item'
              ? numberedListStyles[(hasChildrenDepth || 0) % 3]
              : bulletedListStyles[(hasChildrenDepth || 0) % 3]
        }}
      >
        <li className=''>
          <NotionHasChildrenRender
            block={blocks?.[startIndexForResultBlocks]}
            parentBlockType={block.type}
            hasChildrenDepth={hasChildrenDepth}
          >
            <NotionParagraphBlock
              blockId={block.id}
              richText={block[LIST_TYPE]?.rich_text}
              color={block[LIST_TYPE]?.color}
            />
          </NotionHasChildrenRender>
        </li>
        {block.type === blocks?.[nextIndexForResultBlocks]?.type && (
          <NumberedListItem
            block={blocks?.[nextIndexForResultBlocks]}
            startIndexForResultBlocks={nextIndexForResultBlocks}
            baseBlock={baseBlock}
            hasChildrenDepth={hasChildrenDepth}
          />
        )}
      </ul>
    );
  } else {
    return (
      <>
        <li>
          <NotionHasChildrenRender
            block={blocks?.[startIndexForResultBlocks]}
            parentBlockType={block.type}
            hasChildrenDepth={hasChildrenDepth}
          >
            <NotionParagraphBlock
              blockId={block.id}
              richText={block[LIST_TYPE]?.rich_text}
              color={block[LIST_TYPE]?.color}
            />
          </NotionHasChildrenRender>
        </li>
        {block?.type === blocks?.[nextIndexForResultBlocks]?.type && (
          <NumberedListItem
            block={blocks?.[nextIndexForResultBlocks]}
            startIndexForResultBlocks={nextIndexForResultBlocks}
            baseBlock={baseBlock}
            hasChildrenDepth={hasChildrenDepth}
          />
        )}
      </>
    );
  }
};

export default NumberedListItem;
