/* eslint-disable @next/next/no-img-element */
import type React from 'react';
import { notionBlockUrlToRelativePath } from 'src/lib/notion';
import useSWR from 'swr';
import { fetcher } from 'src/lib/swr';
import type { LinkPreview as ILinkPreview } from 'src/types/types';
import config from 'site-config';
import { NotionParagraphText } from '.';

export interface LinkPreviewProps {
  url: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
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
    <div>
      <a href={relativePath} rel='noreferrer' target='_blank'>
        <div className='card card-side flex-row h-[150px] rounded-sm shadow-md bg-base-200/20 dark:bg-base-content/5'>
          <div className='px-4 py-3 card-body basis-[60%] md:basis-[65%]'>
            <h2 className='text-sm card-title line-clamp-2 md:text-lg'>
              <NotionParagraphText>{data?.title}</NotionParagraphText>
            </h2>
            <p className='flex-grow-0 hidden text-xs sm:line-clamp-2 sm:block text-notionColor-gray'>
              <NotionParagraphText>{data?.description}</NotionParagraphText>
            </p>
            <div className='mt-auto text-xs'>
              <div className='flex-grow-0 break-all gap-x-1 text-ellipsis'>
                <p className='line-clamp-2'>
                  {data?.icon && (
                    <img
                      className='inline-block w-[1.1em] h-[1.1em] align-text-bottom mr-1'
                      src={data.icon.charAt(0) === '/' ? new URL(data.icon, url).href : data.icon}
                      alt={`${data?.title || ''}-favicon`}
                      loading='lazy'
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
                loading='lazy'
              />
            </figure>
          )}
        </div>
      </a>
    </div>
  );
};
