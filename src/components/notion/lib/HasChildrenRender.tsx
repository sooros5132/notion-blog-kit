import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlock, BlockType, INotionPage } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface HasChildrenRenderProps {
  block: NotionBlock;
  children?: React.ReactNode;
  parentBlockType?: BlockType;
  hasChildrenDepth?: number;
}

const notPaddingBlockType: Array<BlockType> = ['bulleted_list_item', 'numbered_list_item'];

export const HasChildrenRender: React.FC<HasChildrenRenderProps> = ({
  block,
  children,
  parentBlockType,
  hasChildrenDepth
}) => {
  const { childrenRecord } = useNotionStore();

  return (
    <>
      {children}
      {block?.has_children && (
        <div
          className={parentBlockType && notPaddingBlockType.includes(parentBlockType) ? '' : 'pl-6'}
        >
          <NotionBlocksRender
            blocks={childrenRecord[block.id]?.results}
            baseBlock={childrenRecord[block.id]}
            hasChildrenDepth={(hasChildrenDepth || 0) + 1}
          />
        </div>
      )}
    </>
  );
};
