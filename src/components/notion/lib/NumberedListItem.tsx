import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

interface NumberedListItemProps {
  block: NotionBlock;
  numberOfSameTag: number;
}

const NumberedListItem: React.FC<NumberedListItemProps> = ({ block, numberOfSameTag }) => {
  return (
    <div className='flex'>
      <div className='flex-initial pt-0.5 basis-6 text-right'>{numberOfSameTag + 1}.</div>
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
