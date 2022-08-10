import { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

const dots = ['•', '◦', '▪'];

interface BulletedListItemProps {
  block: NotionBlock;
}

const BulletedListItem: React.FC<BulletedListItemProps> = ({ block }) => {
  return (
    <div className='flex'>
      <div className='flex-initial text-2xl flex-center max-h-7 basis-6 shrink-0'>{dots[0]}</div>
      <div className='flex-auto'>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block.bulleted_list_item.rich_text}
          color={block.bulleted_list_item.color}
        />
      </div>
    </div>
  );
};

export default BulletedListItem;
