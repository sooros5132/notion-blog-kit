import { NotionBlock, IGetNotion } from 'src/types/notion';
import NotionBlockRender from './BlockRender';
import Paragraph, { notionColorClasses } from './Paragraph';

interface ToggleProps {
  block: NotionBlock;
  blocks: IGetNotion;
  chilrenBlockDepth?: number;
}

const Toggle: React.FC<ToggleProps> = ({ block, blocks, chilrenBlockDepth }) => {
  return (
    <div
      className={
        block.toggle.color !== 'default' ? notionColorClasses[block.toggle.color] : undefined
      }
    >
      <details className='notion-toggle'>
        <summary className='flex cursor-pointer marker'>
          <div className='flex-auto'>
            <Paragraph blockId={block.id} richText={block.toggle.rich_text} />
          </div>
        </summary>
        <NotionBlockRender block={block} blocks={blocks} chilrenBlockDepth={chilrenBlockDepth} />
      </details>
    </div>
  );
};

export default Toggle;
