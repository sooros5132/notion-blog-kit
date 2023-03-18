import classNames from 'classnames';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { NEXT_IMAGE_DOMAINS } from 'site-config';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';
import { FileObject, IconObject } from 'src/types/notion';
import { isExpired, NotionImageFetcherParams, useRenewExpiredFile } from './utils';

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
  initialFileObject,
  alt,
  loading
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

        bulrImage = notiomImageSrc + '&width=30';
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
        <img className={'image w-full'} alt={alt} src={bulrImage} loading='eager' />
      )}
      {(fileObject?.file && !isExpired(fileObject?.file)) || fileObject?.external?.url ? (
        <img
          key={'originImage'}
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
      ) : null}
    </div>
  );
};

export default NotionSecureImage;
