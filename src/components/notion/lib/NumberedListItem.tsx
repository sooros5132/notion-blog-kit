import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

interface NumberedListItemProps {
  block: NotionBlock;
  numberOfSameTag: number;
}

const NumberedListItem: React.FC<NumberedListItemProps> = ({ block, numberOfSameTag }) => {
  return (
    <div className='flex'>
      <div className='basis-6 grow-0 shrink-0 pt-0.5 text-right'>{numberOfSameTag + 1}.</div>
      <div className='flex-auto'>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block.numbered_list_item.rich_text}
          color={block.numbered_list_item.color}
        />
      </div>
    </div>
  );
};

export default NumberedListItem;
