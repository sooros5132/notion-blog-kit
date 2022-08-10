import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import useSWR from 'swr';
import { fetcher } from 'src/lib/swr';
import type { LinkPreview as ILinkPreview } from 'src/types/types';
import config from 'site-setting';
import { NotionParagraphText } from '.';

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
      <div className='flex-col-reverse rounded-sm shadow-xl card card-side bg-base-100 sm:flex-row'>
        <div className='px-4 py-3 card-body'>
          <h2 className='text-lg card-title line-clamp-2'>
            <NotionParagraphText>{data?.title}</NotionParagraphText>
          </h2>
          <p className='flex-grow-0 text-sm line-clamp-3 text-notionColor-gray'>
            <NotionParagraphText>{data?.description}</NotionParagraphText>
          </p>
          <div className='mt-auto text-sm'>
            <div className='flex-grow-0 break-all flex-align-items-center gap-x-1 text-ellipsis'>
              {data?.icon && (
                <img
                  className='w-[1.2em] h-[1.2em]'
                  src={data.icon.charAt(0) === '/' ? new URL(data.icon, url).href : data.icon}
                />
              )}
              <p>{url}</p>
            </div>
          </div>
        </div>
        {data?.image?.url && (
          <figure className='image-wrapper shrink-0 max-w-none sm:min-h-full sm:max-w-[200px] md:max-w-[300px] lg:max-w-[350px]'>
            <img
              className='w-full sm:h-full max-h-[175px]'
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
