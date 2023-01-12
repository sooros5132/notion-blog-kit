import classNames from 'classnames';
import type React from 'react';
import type { NotionBlock, NotionBlocks } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface NumberedListItemProps {
  block: NotionBlock;
  baseBlock: NotionBlocks;
  startIndexForResultBlocks: number;
  chilrenBlockDepth: number;
  children?: React.ReactNode;
}

const NumberedListItem: React.FC<NumberedListItemProps> = ({
  block,
  baseBlock,
  chilrenBlockDepth: chilrenBlockDepthProps,
  startIndexForResultBlocks
}) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const chilrenBlockDepth = block.has_children
    ? chilrenBlockDepthProps + 1
    : chilrenBlockDepthProps;
  const prevIndexForResultBlocks = startIndexForResultBlocks - 1;
  const nextIndexForResultBlocks = startIndexForResultBlocks + 1;
  const blocks = baseBlock?.results;

  if (blocks?.[prevIndexForResultBlocks]?.type !== block.type) {
    return (
      <ul
        className={classNames(
          //? 0번째 depth는 백의 자리부터 공간이 부족해 보임. 추가 공간 주기
          chilrenBlockDepth ? 'pl-8' : 'pl-6',
          LIST_TYPE === 'numbered_list_item' ? 'list-decimal' : 'list-disc'
        )}
      >
        <li>
          <NotionHasChildrenRender
            block={blocks?.[startIndexForResultBlocks]}
            chilrenBlockDepth={chilrenBlockDepth}
            parentBlockType={block.type}
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
            chilrenBlockDepth={chilrenBlockDepth}
            baseBlock={baseBlock}
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
            chilrenBlockDepth={chilrenBlockDepth}
            parentBlockType={block.type}
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
            chilrenBlockDepth={chilrenBlockDepth}
            baseBlock={baseBlock}
          />
        )}
      </>
    );
  }
};

export default NumberedListItem;
