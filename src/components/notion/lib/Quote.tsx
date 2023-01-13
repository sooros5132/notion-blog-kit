import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

export interface QuoteProps {
  block: NotionBlock;
  children?: React.ReactNode;
}

const Quote: React.FC<QuoteProps> = ({ block, children }) => {
  return (
    <div className='p-0.5'>
      <div className='bg-base-content/10 py-1.5 px-3 border-l-[0.3125rem] border-solid border-base-content'>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block.quote.rich_text}
          color={block.quote.color}
        />
        {children}
      </div>
    </div>
  );
};

export default Quote;
