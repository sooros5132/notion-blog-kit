import type React from 'react';
import type { NotionBlock, IGetNotion } from 'src/types/notion';
import { NotionBlocksRender } from '.';

interface NotionBlockProps extends IGetNotion {
  block: NotionBlock;
  children?: React.ReactNode;
  chilrenBlockDepth?: number;
}

export const BlockRender: React.FC<NotionBlockProps> = ({
  block,
  blocks,
  childrenBlocks,
  databaseBlocks,
  children,
  chilrenBlockDepth
}) => {
  return (
    <div>
      {children}
      {block?.has_children && typeof chilrenBlockDepth === 'number' && chilrenBlockDepth > 0 && (
        <div className='ml-6'>
          <NotionBlocksRender
            blocks={childrenBlocks[block.id]}
            childrenBlocks={childrenBlocks}
            databaseBlocks={databaseBlocks}
          />
        </div>
      )}
    </div>
  );
};
