'use client';

import type { ChildrensRecord, DatabasesRecord, ID, NotionBlocksRetrieve } from '@/types/notion';
import { NotionBlocksRender } from '.';
import { cn } from '@/lib/utils';

interface HasChildrenRenderProps {
  block: NotionBlocksRetrieve;
  fromBlockId?: ID;
  children?: React.ReactNode;
  noLeftPadding?: boolean;
  className?: string;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const HasChildrenRender: React.FC<HasChildrenRenderProps> = ({
  block,
  fromBlockId,
  children,
  noLeftPadding,
  className,
  childrensRecord,
  databasesRecord
}) => {
  return (
    <>
      {children}
      {block?.has_children && (
        <div className={cn(className ? className : '', noLeftPadding ? '' : 'pl-6')}>
          <NotionBlocksRender
            blocks={childrensRecord?.[fromBlockId || block.id]?.results}
            childrensRecord={childrensRecord}
            databasesRecord={databasesRecord}
          />
        </div>
      )}
    </>
  );
};
