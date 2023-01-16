import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';

interface ImageProps {
  block: NotionBlock;
}

export const Image: React.FC<ImageProps> = ({ block }) => {
  const caption = Array.isArray(block.image.caption)
    ? block.image.caption
        .map((richText) => richText.plain_text)
        .join('')
        .slice(0, 100) || ''
    : '';
  return (
    <figure>
      <NotionSecureImage
        blockId={block.id}
        blockType='image'
        useType='image'
        initialFileObject={block.image}
        alt={caption}
        loading='eager'
        loadingHeight='15em'
      />
      {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
        <figcaption className='flex w-full'>
          <NotionParagraphBlock blockId={block.id} richText={block.image.caption} color={'gray'} />
        </figcaption>
      )}
    </figure>
  );
};
