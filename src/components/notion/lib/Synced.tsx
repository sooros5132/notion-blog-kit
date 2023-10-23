'use client';

import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionHasChildrenRender } from '.';

export interface SyncedProps {
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const Synced: React.FC<SyncedProps> = ({ block, childrensRecord, databasesRecord }) => {
  const fromBlockId = block?.synced_block?.synced_from?.block_id;

  return (
    <NotionHasChildrenRender
      block={block}
      fromBlockId={fromBlockId}
      noLeftPadding
      childrensRecord={childrensRecord}
      databasesRecord={databasesRecord}
    />
  );
};
