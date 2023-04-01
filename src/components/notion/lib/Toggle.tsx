import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock, notionColorClasses } from '.';

interface ToggleProps {
  block: NotionBlock;
}

export const Toggle: React.FC<ToggleProps> = ({ block }) => {
  return (
    <div
      className={
        block.toggle.color !== 'default' ? notionColorClasses[block.toggle.color] : undefined
      }
    >
      <details>
        <summary className='[&>div]:inline cursor-pointer'>
          <NotionParagraphBlock blockId={block.id} richText={block.toggle.rich_text} />
        </summary>
        <div className='pl-[0.9rem]'>
          <NotionHasChildrenRender block={block} noLeftPadding />
        </div>
      </details>
    </div>
  );
};
