'use client';

import type { PropsWithChildren } from 'react';
import type { NotionBlocksRetrieve } from '@/types/notion';
import { NotionParagraphBlock } from '.';

export type QuoteProps = PropsWithChildren<{
  block: NotionBlocksRetrieve;
}>;

export const Quote: React.FC<QuoteProps> = ({ block }) => {
  const quote = block.quote;
  const { color, rich_text } = quote;

  return (
    <div className='bg-foreground/5 py-1 px-3 border-l-[0.3125rem] border-solid border-foreground'>
      <NotionParagraphBlock blockId={block.id} richText={rich_text} color={color} />
    </div>
  );
};
