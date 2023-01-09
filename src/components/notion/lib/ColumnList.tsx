import type React from 'react';
import type { IGetNotion, NotionBlock } from 'src/types/notion';
import { NotionBlocksRender } from './';

export interface ColumnListProps extends IGetNotion {
  block: NotionBlock;
}

export const ColumnList: React.FC<ColumnListProps> = ({
  block,
  blocks,
  childrenBlocks,
  databaseBlocks
}) => {
  return (
    <div
      className='grid gap-x-2 [&>*]:overflow-x-auto'
      style={{
        gridTemplateColumns: `repeat(${childrenBlocks[block.id]?.results.length ?? 1}, 1fr)`
      }}
    >
      {childrenBlocks[block.id]?.results.map((block, i) => {
        return (
          <div className='mx-0.5' key={`block-${block.id}-${i}`}>
            <NotionBlocksRender
              blocks={childrenBlocks[block.id]}
              childrenBlocks={childrenBlocks}
              databaseBlocks={databaseBlocks}
            />
          </div>
        );
      })}
    </div>
  );
};
