'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { NotionParagraphBlock } from '.';
import { Checkbox } from '@/components/ui/checkbox';

interface TodoProps {
  block: NotionBlocksRetrieve;
}

export const Todo: React.FC<TodoProps> = ({ block }) => {
  const todo = block.to_do;
  const { checked, color, rich_text } = todo;

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox checked={checked ?? false} />
      <label>
        <NotionParagraphBlock
          blockId={block.id}
          richText={rich_text}
          color={color}
          annotations={
            checked
              ? {
                  color: 'gray',
                  strikethrough: true
                }
              : undefined
          }
        />
      </label>
    </div>
  );
};
