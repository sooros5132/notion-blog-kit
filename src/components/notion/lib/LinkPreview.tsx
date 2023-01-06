import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import useSWR from 'swr';
import { fetcher } from 'src/lib/swr';
import type { LinkPreview as ILinkPreview } from 'src/types/types';
import config from 'site-config';
import { NotionParagraphText } from '..';

export interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const { data, error, isValidating } = useSWR<ILinkPreview>(
    `${config.path}/linkPreview/${encodeURIComponent(url)}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  const relativePath = notionBlockUrlToRelativePath(url);

  if (error || isValidating) {
    return (
      <a className='underline' href={relativePath} rel='noreferrer' target='_blank'>
        <NotionParagraphText>{url}</NotionParagraphText>
      </a>
    );
  }

  return (
    <a href={relativePath} rel='noreferrer' target='_blank'>
      <div className='rounded-sm shadow-xl card card-side bg-base-100 flex-row h-[150px]'>
        <div className='px-4 py-3 card-body basis-[60%] md:basis-[65%]'>
          <h2 className='text-lg card-title line-clamp-2'>
            <NotionParagraphText>{data?.title}</NotionParagraphText>
          </h2>
          <p className='flex-grow-0 hidden text-sm sm:line-clamp-2 sm:block text-notionColor-gray'>
            <NotionParagraphText>{data?.description}</NotionParagraphText>
          </p>
          <div className='mt-auto text-sm'>
            <div className='flex-grow-0 break-all gap-x-1 text-ellipsis'>
              <p className='line-clamp-2'>
                {data?.icon && (
                  <img
                    className='inline-block w-[1.1em] h-[1.1em] align-text-bottom mr-1'
                    src={data.icon.charAt(0) === '/' ? new URL(data.icon, url).href : data.icon}
                  />
                )}
                {url}
              </p>
            </div>
          </div>
        </div>
        {data?.image?.url && (
          <figure className='image-wrapper min-h-full basis-[40%] md:basis-[35%]'>
            <img
              className='w-full sm:h-full min-h-[200px] max-h-[200px] sm:min-h-[125px] sm:max-h-[initial]'
              src={
                data.image.url.charAt(0) === '/'
                  ? new URL(data.image.url, url).href
                  : data.image.url
              }
              alt={data?.image?.alt ?? undefined}
            />
          </figure>
        )}
      </div>
    </a>
  );
};

export default LinkPreview;
