import type React from 'react';
import type { NotionBlocksRetrieve, NotionPageBlocks } from 'src/types/notion';
import { NotionHasChildrenRender, NotionParagraphBlock } from '.';

interface ListProps {
  block: NotionBlocksRetrieve;
  children?: React.ReactNode;
  startValue?: number;
}

export const List: React.FC<ListProps> = ({ block, startValue }) => {
  const LIST_TYPE = block.type as 'bulleted_list_item' | 'numbered_list_item';
  const ListTagName = LIST_TYPE === 'numbered_list_item' ? 'ol' : 'ul';

  return (
    <ListTagName className='list-style-type pl-6'>
      <li value={startValue}>
        <NotionHasChildrenRender block={block} noLeftPadding>
          <NotionParagraphBlock
            blockId={block.id}
            richText={block[LIST_TYPE]?.rich_text}
            color={block[LIST_TYPE]?.color}
          />
        </NotionHasChildrenRender>
      </li>
    </ListTagName>
  );
};
