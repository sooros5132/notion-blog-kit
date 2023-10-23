'use client';

import { notionColorClasses } from '@/lib/notion';
import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface ToggleProps {
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
}

export const Toggle: React.FC<ToggleProps> = ({ block, childrensRecord, databasesRecord }) => {
  return (
    <div
      className={
        block.toggle.color !== 'default' ? notionColorClasses[block.toggle.color] : undefined
      }
    >
      <details>
        <summary className='[&>div]:inline cursor-pointer'>
          <NotionParagraphBlock blockId={block.id} richText={block.toggle.rich_text} />
        </summary>
        <div className='pl-[0.9rem]'>
          <NotionHasChildrenRender
            noLeftPadding
            block={block}
            childrensRecord={childrensRecord}
            databasesRecord={databasesRecord}
          />
        </div>
      </details>
    </div>
  );
};
