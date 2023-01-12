import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

interface TodoProps {
  block: NotionBlock;
}

const Todo: React.FC<TodoProps> = ({ block }) => {
  return (
    <div className='form-control'>
      <label className='label p-0 items-start justify-start cursor-pointer'>
        <div className='pt-1 pr-1 text-right basis-6 shrink-0 grow-0'>
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
            annotations={
              block?.to_do?.checked
                ? {
                    color: 'gray',
                    strikethrough: true
                  }
                : undefined
            }
          />
        </div>
      </label>
    </div>
  );
};

export default Todo;
