import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

interface TodoProps {
  block: NotionBlock;
}

const Todo: React.FC<TodoProps> = ({ block }) => {
  return (
    <div className='flex'>
      <div className='flex-initial pt-1 pr-1 text-right basis-6'>
        <input
          type='checkbox'
          defaultChecked={block?.to_do?.checked ?? false}
          className='w-4 h-4 rounded-sm checkbox'
        />
      </div>
      <div className='flex-auto'>
        <NotionParagraphBlock
          blockId={block.id}
          richText={block.to_do.rich_text}
          color={block.to_do.color}
          annotations={{
            color: block?.to_do?.checked ? 'gray' : undefined,
            strikethrough: block?.to_do?.checked ? true : undefined
          }}
        />
      </div>
    </div>
  );
};

export default Todo;
