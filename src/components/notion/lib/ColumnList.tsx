'use client';

import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionBlocksRender } from './';

export interface ColumnListProps {
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const ColumnList: React.FC<ColumnListProps> = ({
  block,
  childrensRecord,
  databasesRecord
}) => {
  const columns = childrensRecord?.[block.id]?.results;
  return (
    <div
      className='[&>div]:my-0.5 sm:[&>div]:my-0 sm:grid sm:gap-x-1 md:gap-x-2 [&>*]:overflow-x-auto'
      style={{
        gridTemplateColumns: `repeat(${columns?.length ?? 1}, 1fr)`
      }}
    >
      {childrensRecord &&
        columns?.map((columnBlock, i) => {
          return (
            <div key={`block-${block.id}-${i}`}>
              <NotionBlocksRender
                blocks={childrensRecord[columnBlock.id]?.results}
                childrensRecord={childrensRecord}
                databasesRecord={databasesRecord}
              />
            </div>
          );
        })}
    </div>
  );
};
