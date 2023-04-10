import type React from 'react';
import { useNotionStore } from 'src/store/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionBlocksRender } from './';

export interface ColumnListProps {
  block: NotionBlocksRetrieve;
}

export const ColumnList: React.FC<ColumnListProps> = ({ block }) => {
  const childrensRecord = useNotionStore().childrensRecord;

  const columns = childrensRecord[block.id]?.results;
  return (
    <div
      className='[&>div]:my-0.5 sm:[&>div]:my-0 sm:grid sm:gap-x-1 md:gap-x-2 [&>*]:overflow-x-auto'
      style={{
        gridTemplateColumns: `repeat(${columns?.length ?? 1}, 1fr)`
      }}
    >
      {columns?.map((columnBlock, i) => {
        return (
          <div key={`block-${block.id}-${i}`}>
            <NotionBlocksRender blocks={childrensRecord[columnBlock.id]?.results} />
          </div>
        );
      })}
    </div>
  );
};
