import type React from 'react';
import type { NotionBlock, IGetNotion, BlockType } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface NotionBlockProps extends IGetNotion {
  block: NotionBlock;
  children?: React.ReactNode;
  chilrenBlockDepth?: number;
  parentBlockType?: BlockType;
}

const notPaddingBlockType: Array<BlockType> = ['bulleted_list_item', 'numbered_list_item'];

export const BlockRender: React.FC<NotionBlockProps> = ({
  block,
  blocks,
  childrenBlocks,
  databaseBlocks,
  children,
  chilrenBlockDepth,
  parentBlockType
}) => {
  return (
    <>
      {children}
      {block?.has_children && typeof chilrenBlockDepth === 'number' && chilrenBlockDepth > 0 && (
        <div
          className={parentBlockType && notPaddingBlockType.includes(parentBlockType) ? '' : 'pl-6'}
        >
          <NotionBlocksRender
            blocks={childrenBlocks[block.id]}
            childrenBlocks={childrenBlocks}
            databaseBlocks={databaseBlocks}
          />
        </div>
      )}
    </>
  );
};
