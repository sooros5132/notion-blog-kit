import type React from 'react';
import { notionColorClasses } from 'src/lib/notion';
import type { NotionBlocksRetrieve } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface ToggleProps {
  block: NotionBlocksRetrieve;
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
