import type React from 'react';
import type { NotionBlock, NotionBlocks } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface NumberedListItemProps {
  block: NotionBlock;
  baseBlock: NotionBlocks;
  startIndexForResultBlocks: number;
  depthOfNestedList?: number;
  children?: React.ReactNode;
}

const numberedListStyles = ['decimal', 'lower-alpha', 'lower-roman'];
const bulletedListStyles = ['outside', 'circle', 'square'];

const NumberedListItem: React.FC<NumberedListItemProps> = ({
  block,
  baseBlock,
  depthOfNestedList,
  startIndexForResultBlocks
}) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const prevIndexForResultBlocks = startIndexForResultBlocks - 1;
  const nextIndexForResultBlocks = startIndexForResultBlocks + 1;
  const blocks = baseBlock?.results;
  const newDepthOfNestedList = block.has_children
    ? (depthOfNestedList || 0) + 1
    : depthOfNestedList;

  if (blocks?.[prevIndexForResultBlocks]?.type !== block.type) {
    return (
      <ul
        className={'pl-6'}
        style={{
          listStyle:
            LIST_TYPE === 'numbered_list_item'
              ? numberedListStyles[(depthOfNestedList || 0) % 3]
              : bulletedListStyles[(depthOfNestedList || 0) % 3]
        }}
      >
        <li>
          <NotionHasChildrenRender
            block={blocks?.[startIndexForResultBlocks]}
            parentBlockType={block.type}
            depthOfNestedList={newDepthOfNestedList}
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
            depthOfNestedList={depthOfNestedList}
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
            depthOfNestedList={newDepthOfNestedList}
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
            depthOfNestedList={depthOfNestedList}
          />
        )}
      </>
    );
  }
};

export default NumberedListItem;
