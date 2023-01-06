import type { NotionBlock, IGetNotion } from 'src/types/notion';
import { NotionBlocksRender } from '..';

interface NotionBlockProps {
  block: NotionBlock;
  blocks: IGetNotion;
  children?: React.ReactNode;
  chilrenBlockDepth?: number;
}

const BlockRender: React.FC<NotionBlockProps> = ({
  block,
  blocks,
  children,
  chilrenBlockDepth
}) => {
  return (
    <div>
      {children}
      {block?.has_children && typeof chilrenBlockDepth === 'number' && chilrenBlockDepth > 0 && (
        <div className='ml-6'>
          <NotionBlocksRender
            blocks={{
              blocks: blocks['childrenBlocks'][block.id],
              childrenBlocks: blocks.childrenBlocks,
              databaseBlocks: blocks.databaseBlocks
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BlockRender;
