import type { IGetNotion, NotionBlock } from 'src/types/notion';
import { NotionBlocksRender } from './';

export interface ColumnListItemProps {
  blocks: IGetNotion;
  block: NotionBlock;
}

const ColumnListItem: React.FC<ColumnListItemProps> = ({ blocks, block }) => {
  return (
    <div
      key={`block-${block.id}`}
      className='grid gap-x-2 [&>*]:overflow-x-auto'
      style={{
        gridTemplateColumns: `repeat(${
          blocks['childrenBlocks'][block.id]?.results.length ?? 1
        }, 1fr)`
      }}
    >
      {blocks['childrenBlocks'][block.id]?.results.map((block, i) => {
        return (
          <div className='mx-0.5' key={`block-${block.id}-${i}`}>
            <NotionBlocksRender
              blocks={{
                blocks: blocks['childrenBlocks'][block.id],
                childrenBlocks: blocks.childrenBlocks,
                databaseBlocks: blocks.databaseBlocks
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ColumnListItem;
