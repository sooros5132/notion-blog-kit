import type React from 'react';
import type { PropsWithChildren } from 'react';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

export type QuoteProps = PropsWithChildren<{
  block: NotionBlocksRetrieve;
}>;

export const Quote: React.FC<QuoteProps> = ({ block }) => {
  return (
    <div className='bg-base-content/5 py-1 px-3 border-l-[0.3125rem] border-solid border-base-content'>
      <NotionParagraphBlock
        blockId={block.id}
        richText={block.quote.rich_text}
        color={block.quote.color}
      />
    </div>
  );
};
