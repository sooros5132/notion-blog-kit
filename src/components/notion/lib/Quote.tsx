'use client';

import type { ChildrensRecord, DatabasesRecord, NotionBlocksRetrieve } from '@/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

export type QuoteProps = {
  block: NotionBlocksRetrieve;
  childrensRecord: ChildrensRecord;
  databasesRecord: DatabasesRecord;
};

export const Quote: React.FC<QuoteProps> = ({ block, childrensRecord, databasesRecord }) => {
  const quote = block.quote;
  const { color, rich_text } = quote;

  return (
    <div className='bg-foreground/5 py-1 px-3 border-l-[0.3125rem] border-solid border-foreground'>
      <NotionParagraphBlock blockId={block.id} richText={rich_text} color={color} />
      <NotionHasChildrenRender
        block={block}
        noLeftPadding
        childrensRecord={childrensRecord}
        databasesRecord={databasesRecord}
      />
    </div>
  );
};
