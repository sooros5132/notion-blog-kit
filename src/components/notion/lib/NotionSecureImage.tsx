import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { FileObject, IconObject } from 'src/types/notion';
import { NotionImageFetcherParams, useRenewExpiredFile } from './utils';

/* eslint-disable @next/next/no-img-element */
interface NotionSecureImageProps extends NotionImageFetcherParams {
  alt?: HTMLImageElement['alt'];
  loading?: HTMLImageElement['loading'];
}

// placeholder = 'blur',
// blurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  blockId,
  blockType,
  useType,
  alt,
  loading,
  initialFileObject
}) => {
  const cachedFileObject = useRef<(FileObject & IconObject) | undefined>(
    initialFileObject as FileObject & IconObject
  );

  const { data: fileObject, isValidating } = useRenewExpiredFile({
    blockId,
    blockType,
    useType,
    initialFileObject
  });

  useEffect(() => {
    cachedFileObject.current = fileObject;
  }, [fileObject]);

  // try {
  //   // src: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
  //   // pageId: 12345678-abcd-1234-abcd-123456789012
  //   const { host } = new URL(srcProp);

  //   if (NEXT_IMAGE_DOMAINS.includes(host)) {
  //     const src = awsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table });

  //     return (
  //       <div className='relative font-[0px]'>
  //         <Image
  //           className={'image object-cover'}
  //           {...props}
  //           placeholder={placeholder}
  //           blurDataURL={blurDataURL}
  //           width={size.width}
  //           height={size.height}

  //           src={src}
  //           onLoadingComplete={(img) => {
  //             const { naturalHeight, naturalWidth } = img;
  //             console.log(img);
  //             setSize({ height: naturalHeight, width: naturalWidth });
  //           }}
  //         />
  //       </div>
  //     );
  //   }
  //   throw '';
  // } catch (e) {}
  if (isValidating) {
    return (
      <div className='flex-center animate-spin text-[1em]'>
        <AiOutlineLoading3Quarters />
      </div>
    );
  }

  return (
    <div className='image-wrapper'>
      <img
        className={'image'}
        alt={alt}
        // src={}
        src={fileObject?.file?.url || fileObject?.external?.url || ''}
        loading={loading || 'lazy'}
      />
    </div>
  );
};

export default NotionSecureImage;
