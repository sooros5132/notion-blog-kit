import { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';

interface ImageProps {
  block: NotionBlock;
}

const Image: React.FC<ImageProps> = ({ block }) => {
  return (
    <div className='flex justify-center'>
      <div>
        <NotionSecureImage
          blockId={block.id}
          src={block.image?.file?.url ?? block.image?.external?.url ?? ''}
        />
        {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
          <div className='w-full'>
            <NotionParagraphBlock
              blockId={block.id}
              richText={block.image.caption}
              color={'gray'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Image;
