import type React from 'react';
import type { NotionBlock } from 'src/types/notion';
import { NotionParagraphBlock, NotionSecureImage } from '.';

interface ImageProps {
  block: NotionBlock;
}

export const Image: React.FC<ImageProps> = ({ block }) => {
  return (
    <figure>
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
      {Array.isArray(block?.image?.caption) && block?.image?.caption?.length > 0 && (
        <figcaption className='flex w-full'>
          <NotionParagraphBlock blockId={block.id} richText={block.image.caption} color={'gray'} />
        </figcaption>
      )}
    </figure>
  );
};

// export type IsExpiredImageParams = NonNullable<FileObject>;

// export function isExpiredImage({ file }: IsExpiredImageParams) {}

// type NotionImageFetcherParams = {
//   blockId: string;
//   blockType: BlockType;
//   imageType: 'image' | 'icon' | 'cover';
//   initialFileObject?: FileObject;
// };

// export const useNotionRenewExpirationImageFetcher = ({
//   blockId,
//   blockType,
//   imageType,
//   initialFileObject
// }: NotionImageFetcherParams): FileObject | undefined => {
//   const fileObject = useSWR<FileObject | undefined>(
//     `${config.path}/notion/blocks/${blockId}`,
//     async (fetchUrl) => {
//       if (
//         !blockId ||
//         !blockType ||
//         !initialFileObject?.file?.url ||
//         !initialFileObject?.file?.expiry_time
//       ) {
//         return undefined;
//       }

//       const { url, expiry_time } = initialFileObject.file;

//       const now = Date.now();
//       if (!url && !expiry_time && now < Date.parse(expiry_time)) {
//         return true;
//       }

//       const block = await axios.get(fetchUrl).then((res) => res.data);

//       return block?.[blockType]?.file || block?.[blockType]?.[imageType]?.file || initialFileObject;
//     },
//     {
//       fallbackData: initialFileObject
//     }
//   );

//   return fileObject.data;
// };
