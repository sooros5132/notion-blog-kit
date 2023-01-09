import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';

interface ImageProps {
  block: NotionBlock;
}

export const Image: React.FC<ImageProps> = ({ block }) => {
  return (
    <div className='flex justify-center'>
      <div>
        <div className='text-center font-[0px]'>
          <NotionSecureImage
            alt={
              block.image.caption
                .map((richText) => richText.plain_text)
                .join('')
                .slice(0, 100) || ''
            }
            blockId={block.id}
            src={block.image?.file?.url ?? block.image?.external?.url ?? ''}
          />
        </div>
        {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
          <div className='flex w-full'>
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
