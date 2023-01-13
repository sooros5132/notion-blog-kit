import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlock, NotionBlocks } from 'src/types/notion';
import { NotionBlocksRender } from './';

export interface ColumnListProps {
  block: NotionBlock;
  baseBlock: NotionBlocks;
}

export const ColumnList: React.FC<ColumnListProps> = ({ block, baseBlock }) => {
  const childrenRecord = useNotionStore.getState().childrenRecord;
  // ((state) => state.childrenRecord, shallow);

  const columns = childrenRecord[block.id]?.results;
  return (
    <div
      className='grid gap-x-1 md:gap-x-2 [&>*]:overflow-x-auto'
      style={{
        gridTemplateColumns: `repeat(${columns?.length ?? 1}, 1fr)`
      }}
    >
      {columns?.map((columnBlock, i) => {
        return (
          <div key={`block-${block.id}-${i}`}>
            <NotionBlocksRender
              blocks={childrenRecord[columnBlock.id]?.results}
              baseBlock={baseBlock}
            />
          </div>
        );
      })}
    </div>
  );
};
