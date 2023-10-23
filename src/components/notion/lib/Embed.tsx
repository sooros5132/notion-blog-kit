'use client';

import type { NotionBlocksRetrieve } from '@/types/notion';
import { NotionParagraphBlock } from '.';
import { NoSsrWrapper } from '@/components/modules/NoSsrWrapper';

interface EmbedProps {
  block: NotionBlocksRetrieve;
}

export function Embed({ block }: EmbedProps) {
  return (
    <div>
      <div>
        <NoSsrWrapper>
          <EmbedInner block={block} />
        </NoSsrWrapper>
      </div>
      <div>
        <NotionParagraphBlock blockId={block.id} richText={block.embed.caption} color={'gray'} />
      </div>
    </div>
  );
}

function EmbedInner({ block }: EmbedProps) {
  try {
    const embed = block.embed;
    const url = new URL(embed.url);
    const domain = url.hostname;

    switch (domain) {
      case 'open.spotify.com': {
        return (
          <iframe
            className='rounded-xl'
            width='100%'
            height='352'
            src={`https://open.spotify.com/embed/${url.pathname}${url.search}`}
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
          />
        );
      }
      case 'www.google.com':
      case 'google.com': {
        if (url?.search && url.pathname.startsWith('/maps/embed')) {
          return (
            <iframe
              className='w-full h-72 sm:h-96'
              src={`https://www.google.com/maps/embed${url.search}`}
              width='100%'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          );
        }
      }
      default: {
        return <></>;
      }
    }
  } catch (e) {
    return <></>;
  }
}
