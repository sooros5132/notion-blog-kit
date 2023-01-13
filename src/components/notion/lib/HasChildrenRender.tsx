import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlock, BlockType } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface HasChildrenRenderProps {
  block: NotionBlock;
  children?: React.ReactNode;
  parentBlockType?: BlockType;
  depthOfNestedList?: number;
}

const notPaddingBlockType: Array<BlockType> = ['bulleted_list_item', 'numbered_list_item'];

export const HasChildrenRender: React.FC<HasChildrenRenderProps> = ({
  block,
  children,
  parentBlockType,
  depthOfNestedList
}) => {
  const childrenRecord = useNotionStore.getState().childrenRecord;
  // ((state) => state.childrenRecord, shallow);

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
            depthOfNestedList={
              childrenRecord[block.id]?.results?.[0]?.type === block.type ? depthOfNestedList : 0
            }
          />
        </div>
      )}
    </>
  );
};
