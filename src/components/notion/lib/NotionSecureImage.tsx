import classNames from 'classnames';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { NEXT_IMAGE_DOMAINS } from 'site-config';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { FileObject, IconObject } from 'src/types/notion';
import { isExpired, NotionImageFetcherParams, useRenewExpiredFile } from './utils';

/* eslint-disable @next/next/no-img-element */
interface NotionSecureImageProps extends NotionImageFetcherParams {
  alt?: HTMLImageElement['alt'];
  loading?: HTMLImageElement['loading'];
  useNextImage?: boolean;
  quality?: number;
  sizes?: {
    width: number;
    height: number;
  };
}

// placeholder = 'blur',
// blurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
export const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  blockId,
  blockType,
  useType,
  initialFileObject,
  alt,
  loading,
  quality,
  sizes,
  useNextImage = false
}) => {
  const [isOriginalImageLoaded, setOriginalImageLoaded] = useState(
    initialFileObject?.file?.url ? !isExpired(initialFileObject?.file) : true
  );
  const cachedFileObject = useRef<(FileObject & IconObject) | undefined>(
    initialFileObject as FileObject & IconObject
  );

  const { data: fileObject } = useRenewExpiredFile({
    blockId,
    blockType,
    useType,
    initialFileObject: cachedFileObject.current,
    autoRefresh: loading === 'eager' ? false : true // eager은 refresh 제외
  });

  let bulrImage: string | null = null;
  {
    if (fileObject?.file?.url) {
      const s3AmazonImageSrc = fileObject?.file?.url;
      const { host } = new URL(s3AmazonImageSrc);
      if (NEXT_IMAGE_DOMAINS.includes(host)) {
        const notiomImageSrc = awsImageObjectUrlToNotionUrl({
          s3ObjectUrl: s3AmazonImageSrc,
          blockId
        });

        bulrImage = notiomImageSrc + '&width=24';
      }
    }
  }

  useEffect(() => {
    if (isOriginalImageLoaded) {
      cachedFileObject.current = fileObject;
    }
  }, [fileObject, isOriginalImageLoaded]);

  return (
    <div className='image-wrapper relative'>
      {bulrImage && !isOriginalImageLoaded && !fileObject?.external?.url && (
        <>
          <img className='image w-full h-full blur-md' alt={alt} src={bulrImage} loading='eager' />
          <div className='absolute top-0 left-0 w-full h-full flex-center text-4xl text-white rounded-xl opacity-70 pointer-events-none md:text-5xl md:rounded-3xl'>
            <div className='animate-spin'>
              <AiOutlineLoading3Quarters className='drop-shadow-[0_0_2px_#000000]' />
            </div>
          </div>
        </>
      )}
      {(fileObject?.file && !isExpired(fileObject?.file)) || fileObject?.external?.url ? (
        useNextImage ? (
          <Image
            key='nextImage'
            className={classNames(
              'image',
              isOriginalImageLoaded ? null : 'opacity-0 w-0 h-0 absolute top-0 left-0'
            )}
            loading={loading || 'lazy'}
            src={fileObject?.file?.url || fileObject?.external?.url || ''}
            alt={alt!}
            fill={sizes ? undefined : true}
            width={sizes?.width}
            height={sizes?.height}
            quality={quality}
            onLoad={() => {
              if (!isOriginalImageLoaded) {
                setOriginalImageLoaded(true);
              }
            }}
          />
        ) : (
          <img
            key='originImage'
            className={classNames(
              'image',
              isOriginalImageLoaded ? null : 'opacity-0 w-0 h-0 absolute top-0 left-0'
            )}
            loading={loading || 'lazy'}
            src={fileObject?.file?.url || fileObject?.external?.url || ''}
            alt={alt}
            onLoad={() => {
              if (!isOriginalImageLoaded) {
                setOriginalImageLoaded(true);
              }
            }}
          />
        )
      ) : null}
    </div>
  );
};
