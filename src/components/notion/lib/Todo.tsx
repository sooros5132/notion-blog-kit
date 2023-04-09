import type React from 'react';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionParagraphBlock } from '.';

interface TodoProps {
  block: NotionBlocksRetrieve;
}

export const Todo: React.FC<TodoProps> = ({ block }) => {
  return (
    <div className='form-control'>
      <label className='label p-0'>
        <div className='shrink-0 grow-0 pt-0.5 pr-1 self-start'>
          <input
            type='checkbox'
            checked={block?.to_do?.checked ?? false}
            readOnly
            className='rounded-sm checkbox checkbox-xs'
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
