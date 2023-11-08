'use client';

import { notionBlockUrlToRelativePath } from '@/lib/notion';
import { NotionParagraphText } from '.';
import { AiOutlineLink } from 'react-icons/ai';
import { LinkPreviewObject } from '@/types/notion';

export interface LinkPreviewProps {
  linkPreview: LinkPreviewObject;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ linkPreview }) => {
  const { url, description, icon, image, media, title, type, username } = linkPreview;
  // const { data, error, isValidating } = useSWR<ILinkPreview>(
  //   `${siteConfig.path}/linkPreview/${encodeURIComponent(url)}`,
  //   fetcher,
  //   {
  //     fallbackData: {
  //       username: null,
  //       description: null,
  //       icon: null,
  //       image: {
  //         alt: null,
  //         url: null
  //       },
  //       media: null,
  //       title: null,
  //       type: null
  //     },
  //     revalidateOnFocus: false
  //   }
  // );

  const relativePath = notionBlockUrlToRelativePath(url);

  return (
    <a href={relativePath} className='block my-2' rel='noreferrer' target='_blank'>
      <div className='flex rounded-md border border-foreground/10 overflow-hidden dark:bg-foreground/5'>
        <div className='flex flex-col flex-auto px-4 py-3 gap-y-1 basis-[60%] md:basis-[65%] overflow-hidden'>
          {title && (
            <h2 className='flex-auto grow-0 shrink-0 text-sm line-clamp-2 md:text-lg md:leading-6'>
              <NotionParagraphText>{title}</NotionParagraphText>
            </h2>
          )}
          {description && (
            <p className='flex-auto text-xs line-clamp-2 text-notion-gray'>
              <NotionParagraphText>{description}</NotionParagraphText>
            </p>
          )}
          <p className='flex-auto shrink-0 mt-auto text-xs break-all line-clamp-2 sm:line-clamp-1'>
            {!icon ? (
              <AiOutlineLink className='inline-block align-text-bottom text-[1.1em]' />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className='inline-block w-[1.1em] h-[1.1em] align-text-bottom mr-1'
                src={icon.charAt(0) === '/' ? new URL(icon, url).href : icon}
                alt={`${title || ''}-favicon`}
                loading='lazy'
              />
            )}
            {url}
          </p>
        </div>
        {image?.url ? (
          <figure className='relative image-wrapper hidden sm:block flex-auto shrink-0 min-h-full basis-[40%] md:basis-[35%] overflow-hidden'>
            {image?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className='absolute w-full h-full'
                src={image.url.charAt(0) === '/' ? new URL(image.url, url).href : image.url}
                alt={image?.alt ?? undefined}
                loading='lazy'
              />
            )}
          </figure>
        ) : null}
      </div>
    </a>
  );
};
