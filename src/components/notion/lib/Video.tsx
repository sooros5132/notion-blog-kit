'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { IoClose } from 'react-icons/io5';
import { NotionParagraphBlock } from '.';
import queryString from 'querystring';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useEffect, useRef } from 'react';
import { NoSsrWrapper } from '@/components/modules/NoSsrWrapper';
import { useRenewExpiredFile } from '@/lib/useRenewExpiredFile';

interface VideoProps {
  block: NotionBlocksRetrieve;
}

export const Video: React.FC<VideoProps> = ({ block }) => {
  return (
    <>
      <NoSsrWrapper>
        <VideoBlockInner block={block}></VideoBlockInner>
      </NoSsrWrapper>
      {Array.isArray(block?.video?.caption) && block?.video?.caption?.length > 0 && (
        <div className='w-full'>
          <NotionParagraphBlock blockId={block.id} richText={block.video.caption} color={'gray'} />
        </div>
      )}
    </>
  );
};

const VideoBlockInner: React.FC<VideoProps> = ({ block }) => {
  const cachedFileObject = useRef(block.video);

  const {
    data: fileObject,
    isValidating,
    error
  } = useRenewExpiredFile({
    blockId: block.id,
    blockType: 'video',
    useType: 'video',
    initialFileObject: cachedFileObject.current
  });

  useEffect(() => {
    cachedFileObject.current = fileObject as typeof cachedFileObject.current;
  }, [fileObject]);

  if (!fileObject || error) {
    return (
      <div className='flex-center py-0.5 bg-gray-900'>
        <div className='flex items-center text-notion-red'>
          <IoClose />
        </div>
        &nbsp;
        <p>Not found video.</p>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className='flex-center py-2 bg-gray-900'>
        <div className='flex items-center animate-spin'>
          <AiOutlineLoading3Quarters />
        </div>
        &nbsp;
        <p>video validating...</p>
      </div>
    );
  }

  if (fileObject?.type === 'file') {
    return <video className='my-2 w-full aspect-video' controls src={fileObject?.file?.url} />;
  } else {
    return (
      <div className='my-2 w-full [&>iframe]:w-full [&>iframe]:aspect-video '>
        <EmbedVideo url={block.video?.external?.url || ''} />
      </div>
    );
  }
};

const EmbedVideo: React.FC<{ url: string }> = ({ url }) => {
  const originalURL = new URL(url);
  const domain = originalURL.hostname;

  switch (domain) {
    case 'youtu.be':
    case 'youtube.com':
    case 'www.youtube.com': {
      // const embedUrl = url.replace(/\/watch\?v=/, '/embed/');
      let embedUrl = '';
      const urlSearch =
        originalURL.search.charAt(0) === '?' ? originalURL.search.slice(1) : originalURL.search;
      const searchParams = queryString.decode(urlSearch);

      if (originalURL.hostname === 'youtu.be') {
        embedUrl = `https://www.youtube.com/embed${originalURL.pathname}${originalURL.search}`;
      } else if (originalURL.pathname === '/watch' && typeof searchParams['v'] === 'string') {
        const { v: _, ...newSearchParams } = searchParams;
        embedUrl = `https://www.youtube.com/embed/${searchParams['v']}?${queryString.encode(
          newSearchParams
        )}`;
      } else if (originalURL.pathname.startsWith('/watch/')) {
        const id = originalURL.pathname.replace(/^\/watch\//, '');
        embedUrl = `https://www.youtube.com/embed/${id}`;
      } else if (originalURL.pathname.startsWith('/w/')) {
        const id = originalURL.pathname.replace(/^\/w\//, '');
        embedUrl = `https://www.youtube.com/embed/${id}`;
      }

      return (
        <iframe
          src={embedUrl || url}
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          loading='lazy'
        />
      );
    }

    default: {
      return (
        <iframe
          src={url}
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          loading='lazy'
        />
      );
    }
  }
};
