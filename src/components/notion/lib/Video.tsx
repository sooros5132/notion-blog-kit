import { IoClose } from 'react-icons/io5';
import config from 'site-config';
import NoSsrWrapper from 'src/lib/NoSsrWrapper';
import { fetcher } from 'src/lib/swr';
import type { NotionBlock } from 'src/types/notion';
import useSWR from 'swr';
import { NotionParagraphBlock } from '.';

interface VideoProps {
  block: NotionBlock;
}

const Video: React.FC<VideoProps> = ({ block }) => {
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
  const { data, error, isValidating } = useSWR<NotionBlock>(
    `${config.path}/notion/blocks/${block.id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 54 * 60 * 1000 // 54분
    }
  );
  if (error) {
    return (
      <div className='w-full'>
        <div className='flex-center py-0.5 bg-gray-900'>
          <div className='flex items-center text-notionColor-red'>
            <IoClose />
          </div>
          &nbsp;
          <p>비디오 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  if (isValidating || (!data?.video?.file?.url && !data?.video?.external?.url)) {
    return (
      <div className='w-full'>
        <div className='flex-center h-[50vw] max-h-[20rem] bg-notionColor-gray_background'>
          <p>비디오 정보를 불러오고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {data?.video.type === 'file' ? (
        <video className='w-full aspect-video' controls src={data?.video.file?.url} />
      ) : (
        <div className='w-full [&>iframe]:w-full [&>iframe]:aspect-video '>
          <EmbedVideo url={data?.video.external?.url || ''} />
        </div>
      )}
    </div>
  );
};

const EmbedVideo: React.FC<{ url: string }> = ({ url }) => {
  const hostname = new URL(url).hostname;

  switch (hostname) {
    case 'youtube.com':
    case 'www.youtube.com': {
      const embedUrl = url.replace(/\/watch\?v=/, '/embed/');
      return (
        <iframe
          src={embedUrl}
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      );
    }

    default: {
      return (
        <iframe
          src={url}
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      );
    }
  }
};

export default Video;
