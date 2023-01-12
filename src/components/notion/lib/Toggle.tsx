import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock, notionColorClasses } from '.';

interface ToggleProps {
  block: NotionBlock;
  chilrenBlockDepth?: number;
}

const Toggle: React.FC<ToggleProps> = ({ block, chilrenBlockDepth }) => {
  return (
    <div
      className={
        block.toggle.color !== 'default' ? notionColorClasses[block.toggle.color] : undefined
      }
    >
      <details className='notion-toggle'>
        <summary className='flex cursor-pointer marker'>
          <div className='flex-auto'>
            <NotionParagraphBlock blockId={block.id} richText={block.toggle.rich_text} />
          </div>
        </summary>
        <div className='pb-2 pr-2'>
          <NotionHasChildrenRender block={block} chilrenBlockDepth={chilrenBlockDepth} />
        </div>
      </details>
    </div>
  );
};

export default Toggle;
