import type { ImageProps } from 'next/image';
import Image from 'next/image';
import { useState } from 'react';
import config, { NEXT_IMAGE_DOMAINS } from 'site-config';
import { awsImageObjectUrlToNotionUrl } from 'src/lib/notion';

interface NotionSecureImageProps extends ImageProps {
  src: string;
  table?: string;
  blockId: string;
}

const NotionSecureImage: React.FC<NotionSecureImageProps> = ({
  children,
  src: srcProp,
  blockId,
  table = 'block',
  placeholder = 'blur',
  blurDataURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  layout = 'intrinsic',
  objectFit = 'contain',
  width = 1024,
  height = 1024,
  ...props
}) => {
  const [size, setSize] = useState({
    width: width || 500,
    height: height || 500
  });

  try {
    // src: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8f7f9f31-56f7-49c3-a05f-d15ac4a722ca/qemu.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220702%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220702T053925Z&X-Amz-Expires=3600&X-Amz-Signature=050701d9bc05ec877366b066584240a31a4b5d2459fe6b7f39243e90d479addd&X-Amz-SignedHeaders=host&x-id=GetObject
    // pageId: 12345678-abcd-1234-abcd-123456789012
    const { host } = new URL(srcProp);

    if (NEXT_IMAGE_DOMAINS.includes(host)) {
      const src = awsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table });

      return (
        <div className='relative font-[0px]'>
          <Image
            className={'image'}
            {...props}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            layout={layout}
            objectFit={objectFit}
            src={src}
            width={layout !== 'fill' ? size.width : undefined}
            height={layout !== 'fill' ? size.height : undefined}
            onLoadingComplete={({ naturalHeight, naturalWidth }) => {
              setSize({ height: naturalHeight, width: naturalWidth });
            }}
          />
        </div>
      );
    }
    throw '';
  } catch (e) {}
  return (
    <div className='image-wrapper'>
      <img
        className={'image'}
        {...props}
        src={awsImageObjectUrlToNotionUrl({ s3ObjectUrl: srcProp, blockId, table })}
        loading='lazy'
      />
    </div>
  );
};

export default NotionSecureImage;
