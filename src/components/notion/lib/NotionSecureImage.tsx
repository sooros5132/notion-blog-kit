import type React from 'react';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FileObject, IconObject } from 'src/types/notion';
import { NotionImageFetcherParams, useRenewExpiredFile } from './utils';

/* eslint-disable @next/next/no-img-element */
interface NotionSecureImageProps extends NotionImageFetcherParams {
  alt?: HTMLImageElement['alt'];
  loading?: HTMLImageElement['loading'];
  loadingHeight?: CSSProperties['height'];
}

// placeholder = 'blur',
// blurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  blockId,
  blockType,
  useType,
  initialFileObject,
  alt,
  loading,
  loadingHeight
}) => {
  const [isHydrated, setHydrated] = useState(false);
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

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (isHydrated && isValidating) {
    return (
      <div
        className='flex-center text-[1em] bg-base-content/10 rounded-sm overflow-hidden animate-pulse'
        style={{ height: loadingHeight || '100%' }}
      >
        <span className='animate-spin '>
          <AiOutlineLoading3Quarters />
        </span>
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
